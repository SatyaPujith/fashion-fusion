import { BodyMeasurements, FitEvaluation, Product } from '../types/fashion';

/**
 * Calculates fit metrics between a garment's specific size and the user's body measurements.
 */
export function evaluateGarmentFit(
  product: Product,
  size: string,
  user: BodyMeasurements
): FitEvaluation {
  const chart = product.measurements[size] || product.measurements['M'] || {};
  
  // Stretch allowance
  const stretchOffset =
    product.stretch === 'high' ? 4 :
    product.stretch === 'medium' ? 2 :
    product.stretch === 'slight' ? 1 : 0;

  // Fit style adjustment
  const fitPreferenceBias =
    user.preferredFit === 'oversized' ? 4 :
    user.preferredFit === 'relaxed' ? 2 :
    user.preferredFit === 'slim' ? -2 : 0;

  // Garment dimensions vs User body dimensions
  const gBust = chart.chest ?? (chart.waist ? chart.waist + 12 : user.bust);
  const gWaist = chart.waist ?? (chart.chest ? chart.chest - 10 : user.waist);
  const gHips = chart.hips ?? (chart.waist ? chart.waist + 20 : user.hips);
  const gShoulder = chart.shoulder ?? user.shoulderWidth;

  const bustDelta = Math.round((gBust + stretchOffset) - user.bust);
  const waistDelta = Math.round((gWaist + stretchOffset) - user.waist);
  const hipsDelta = Math.round((gHips + stretchOffset) - user.hips);
  const shoulderDelta = chart.shoulder ? Math.round(gShoulder - user.shoulderWidth) : undefined;

  // Target ease depending on garment category
  let idealBustEase = 4;
  let idealWaistEase = 3;
  let idealHipsEase = 4;

  if (product.category === 'outerwear') {
    idealBustEase = 8;
    idealWaistEase = 8;
    idealHipsEase = 8;
  } else if (product.category === 'bottoms') {
    idealWaistEase = 2;
    idealHipsEase = 4;
  }

  // Find optimal recommended size across all available sizes
  let bestSize = size;
  let bestFitScore = -999;

  for (const s of product.sizes) {
    const sChart = product.measurements[s];
    if (!sChart) continue;

    const sBust = sChart.chest ?? (sChart.waist ? sChart.waist + 12 : user.bust);
    const sWaist = sChart.waist ?? (sChart.chest ? sChart.chest - 10 : user.waist);
    const sHips = sChart.hips ?? (sChart.waist ? sChart.waist + 20 : user.hips);

    const sBustDiff = Math.abs((sBust + stretchOffset) - (user.bust + idealBustEase + fitPreferenceBias));
    const sWaistDiff = Math.abs((sWaist + stretchOffset) - (user.waist + idealWaistEase + fitPreferenceBias));
    const sHipsDiff = Math.abs((sHips + stretchOffset) - (user.hips + idealHipsEase + fitPreferenceBias));

    const totalDiff = (product.category === 'bottoms' ? 0 : sBustDiff * 1.5) + sWaistDiff * 1.4 + sHipsDiff * 1.0;
    const score = 100 - totalDiff * 2.8;

    if (score > bestFitScore) {
      bestFitScore = score;
      bestSize = s;
    }
  }

  // Calculate score for currently selected size
  const activeBustDiff = product.category === 'bottoms' ? 0 : Math.abs(bustDelta - idealBustEase);
  const activeWaistDiff = Math.abs(waistDelta - idealWaistEase);
  const activeHipsDiff = Math.abs(hipsDelta - idealHipsEase);

  let penalty = (activeBustDiff * 1.6) + (activeWaistDiff * 1.8) + (activeHipsDiff * 1.2);
  
  // Severe penalty if negative ease on non-stretch garment (too small)
  if (bustDelta < 0 && product.category !== 'bottoms') penalty += Math.abs(bustDelta) * 5;
  if (waistDelta < 0) penalty += Math.abs(waistDelta) * 6;
  if (hipsDelta < 0) penalty += Math.abs(hipsDelta) * 5;

  const confidenceScore = Math.max(45, Math.min(99, Math.round(100 - penalty)));

  let status: 'perfect' | 'caution' | 'mismatch' = 'perfect';
  let critique = '';
  let adjustmentAdvice: string | undefined = undefined;

  if (confidenceScore >= 88) {
    status = 'perfect';
    critique = `Flawless silhouette match for your ${user.bust}cm bust & ${user.waist}cm waist profile. Ease is tailored and comfortable.`;
  } else if (confidenceScore >= 70) {
    status = 'caution';
    if (waistDelta < 1 && product.category === 'bottoms') {
      critique = `Runs snug at waist (-${Math.abs(waistDelta)}cm ease). May feel constricting when seated.`;
      adjustmentAdvice = `Consider sizing up to ${bestSize} for ease.`;
    } else if (bustDelta < 1 && product.category !== 'bottoms') {
      critique = `Snug across chest. Fabric will pull slightly under armpits during movement.`;
      adjustmentAdvice = `Size ${bestSize} provides better contour drape.`;
    } else if (waistDelta > 10) {
      critique = `Generous excess fabric around waist (+${waistDelta}cm ease). Relaxed streetwear aesthetic.`;
      adjustmentAdvice = `Choose ${bestSize} if you prefer a sharper tailored fit.`;
    } else {
      critique = `Minor fit variance. Fits wearable but not optimal proportional drape.`;
      adjustmentAdvice = `Recommended size is ${bestSize}.`;
    }
  } else {
    status = 'mismatch';
    if (waistDelta < 0 || bustDelta < 0) {
      critique = `Fit conflict: Too tight for your measurements. High risk of return.`;
      adjustmentAdvice = `Switch to size ${bestSize} (+${Math.abs(Math.min(waistDelta, bustDelta)) + 4}cm breathing room).`;
    } else {
      critique = `Excessively large for your frame; shoulder seams and waist will sag noticeably.`;
      adjustmentAdvice = `Downsize to ${bestSize} for an intentional drape.`;
    }
  }

  return {
    status,
    confidenceScore,
    recommendedSize: bestSize,
    sizeDelta: {
      bustDelta,
      waistDelta,
      hipsDelta,
      shoulderDelta,
    },
    critique,
    adjustmentAdvice,
  };
}

/**
 * Evaluates visual & styling harmony across items selected in Try-On Studio or Cart.
 */
export function evaluateOutfitHarmony(products: (Product | null)[]): {
  score: number;
  verdict: string;
  notes: string[];
  paletteMood: string;
} {
  const activeItems = products.filter((p): p is Product => p !== null);
  if (activeItems.length === 0) {
    return {
      score: 100,
      verdict: 'Studio canvas is empty. Select garments to begin styling.',
      notes: ['Select a top, bottom, or outerwear layer to start.'],
      paletteMood: 'Clean Slate',
    };
  }

  if (activeItems.length === 1) {
    return {
      score: 85,
      verdict: `Strong focal piece with the ${activeItems[0].name}.`,
      notes: [activeItems[0].stylingAdvice],
      paletteMood: 'Solo Silhouette',
    };
  }

  // Tag overlap and harmony logic
  const allTags = activeItems.flatMap(i => i.harmonyTags);
  const tagCounts: Record<string, number> = {};
  allTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });

  const sharedAesthetics = Object.keys(tagCounts).filter(t => tagCounts[t] >= 2);
  const hasClashingFits =
    activeItems.some(i => i.fitType === 'oversized') &&
    activeItems.some(i => i.fitType === 'skinny' as any);

  let baseScore = 80;
  const notes: string[] = [];

  if (sharedAesthetics.length >= 2) {
    baseScore += 14;
    notes.push(`Cohesive aesthetic: Harmonizes through shared ${sharedAesthetics.join(' & ')} motifs.`);
  } else if (sharedAesthetics.length === 1) {
    baseScore += 8;
    notes.push(`Balanced styling linked by subtle ${sharedAesthetics[0]} elements.`);
  } else {
    baseScore -= 4;
    notes.push(`Eclectic pairing: Balances differing design languages for an editorial look.`);
  }

  // Proportion check
  const topOrJacket = activeItems.find(i => i.category === 'outerwear' || i.category === 'tops');
  const bottom = activeItems.find(i => i.category === 'bottoms');

  if (topOrJacket && bottom) {
    if (topOrJacket.fitType === 'oversized' && bottom.fitType === 'relaxed') {
      notes.push('Contemporary modern proportions: Boxy upper silhouette anchored by fluid trousers.');
      baseScore += 4;
    } else if (topOrJacket.fitType === 'slim' && bottom.fitType === 'relaxed') {
      notes.push('High-fashion contrast rule: Fitted upper body beautifully grounds voluminous bottoms.');
      baseScore += 5;
    }
  }

  const finalScore = Math.min(98, Math.max(68, baseScore));

  let verdict = 'Exceptional outfit cohesion.';
  if (finalScore >= 90) {
    verdict = 'Impeccable editorial harmony. Textures, drape, and proportions balance effortlessly.';
  } else if (finalScore >= 80) {
    verdict = 'Balanced everyday luxury. Garments flatter each other with versatile tone and flow.';
  } else {
    verdict = 'Contrasting styling. Bold combination that creates intentional visual tension.';
  }

  return {
    score: finalScore,
    verdict,
    notes,
    paletteMood: sharedAesthetics[0] || 'Neutral Chic',
  };
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../components/ui/dialog"
import { ThumbsUp, Camera, Heart, MessageCircle, Share2, X, Palette, LogIn, UserPlus, Settings, Grid, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { login, register, createPost, getPosts } from '../frontend/api';
type ClothingItem = {
  id: string;
  type: 'top' | 'bottom';
  image: string;
  color: string;
}

type Post = {
  id: number;
  user: string;
  avatar: string;
  image: string;
  likes: number;
  comments: number;
  content: string;
  timestamp: string;
}

type User = {
  username: string;
  password: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
}

export default function Component() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [isSignUp, setIsSignUp] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [matchedOutfit, setMatchedOutfit] = useState<{ top: ClothingItem; bottom: ClothingItem } | null>(null)
  const [userPoints, setUserPoints] = useState(1250)
  const [userLevel, setUserLevel] = useState("Fashion Enthusiast")
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, user: "FashionLover1", avatar: "../public/placeholder.svg?height=40&width=40", image: "/placeholder.svg?height=50&width=400", likes: 24, comments: 5, content: "Check out my new summer look!", timestamp: "2 hours ago" },
    { id: 2, user: "StyleGuru", avatar: "../public/placeholder.svg?height=40&width=40", image: "/placeholder.svg?height=50&width=400", likes: 18, comments: 3, content: "Loving this vintage find!", timestamp: "3 hours ago" },
    { id: 3, user: "TrendSetter", avatar: "../public/placeholder.svg?height=40&width=40", image: "/placeholder.svg?height=50&width=400", likes: 32, comments: 7, content: "Street style inspiration for you all!", timestamp: "5 hours ago" },
  ])
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([])
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostImage, setNewPostImage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bottomFileInputRef = useRef<HTMLInputElement>(null)
  const postImageInputRef = useRef<HTMLInputElement>(null)

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSignUp) {
      // Sign up
      if (users.some(user => user.username === username)) {
        alert("Username already exists. Please choose a different one.")
        return
      }
      const newUser: User = {
        username,
        password,
        avatar: "/profile.svg?height=100&width=100",
        bio: "New Fashion Fusion user",
        followers: 0,
        following: 0
      }
      setUsers([...users, newUser])
      setCurrentUser(newUser)
      setIsLoggedIn(true)
      addPoints(10) // Bonus points for signing up
    } else {
      // Login
      const user = users.find(user => user.username === username && user.password === password)
      if (user) {
        setCurrentUser(user)
        setIsLoggedIn(true)
        addPoints(5) // Daily login points
      } else {
        alert("Invalid username or password")
      }
    }
    setUsername('')
    setPassword('')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    setUsername('')
    setPassword('')
  }

  const handleOutfitMatch = () => {
    const tops = clothingItems.filter(item => item.type === 'top')
    const bottoms = clothingItems.filter(item => item.type === 'bottom')

    if (tops.length > 0 && bottoms.length > 0) {
      // Simple color matching algorithm
      const matchedTop = tops[Math.floor(Math.random() * tops.length)]
      const matchedBottom = bottoms.reduce((best, current) => {
        return getColorDistance(matchedTop.color, current.color) < getColorDistance(matchedTop.color, best.color) ? current : best
      })

      setMatchedOutfit({ top: matchedTop, bottom: matchedBottom })
      subPoints(10)
    } else {
      alert("Please upload at least one top and one bottom item before matching.")
    }
  }

  const getColorDistance = (color1: string, color2: string) => {
    const r1 = parseInt(color1.slice(1, 3), 16)
    const g1 = parseInt(color1.slice(3, 5), 16)
    const b1 = parseInt(color1.slice(5, 7), 16)
    const r2 = parseInt(color2.slice(1, 3), 16)
    const g2 = parseInt(color2.slice(3, 5), 16)
    const b2 = parseInt(color2.slice(5, 7), 16)
    return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2))
  }

  const subPoints = (points: number) => {
    setUserPoints(prevPoints => prevPoints - points)
  }

  const addPoints = (points: number) => {
    setUserPoints(prevPoints => prevPoints + points)
  }

  useEffect(() => {
    if (userPoints >= 2000) setUserLevel("Fashion Icon")
    else if (userPoints >= 1500) setUserLevel("Style Master")
    else setUserLevel("Fashion Enthusiast")
  }, [userPoints])

  const handleLike = (postId: number) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
    addPoints(1)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'top' | 'bottom') => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0)
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)
          const dominantColor = getDominantColor(imageData?.data)
          
          setClothingItems(prev => [...prev, {
            id: Date.now().toString(),
            type,
            image: e.target?.result as string,
            color: dominantColor
          }])
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
      subPoints(20) // Changed from addPoints to subPoints
    }
  }

  const getDominantColor = (data?: Uint8ClampedArray): string => {
    if (!data) return '#000000'
    let r = 0, g = 0, b = 0
    for (let i = 0; i < data.length; i += 4) {
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
    }
    r = Math.floor(r / (data.length / 4))
    g = Math.floor(g / (data.length / 4))
    b = Math.floor(b / (data.length / 4))
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  const removeClothingItem = (id: string) => {
    setClothingItems(prev => prev.filter(item => item.id !== id))
  }

  const handleCreatePost = () => {
    if (newPostContent && newPostImage && currentUser) {
      const newPost: Post = {
        id: Date.now(),
        user: currentUser.username,
        avatar: currentUser.avatar,
        image: newPostImage,
        likes: 0,
        comments: 0,
        content: newPostContent,
        timestamp: "Just now"
      }
      setPosts(prevPosts => [newPost, ...prevPosts])
      setNewPostContent('')
      setNewPostImage('')
      addPoints(5) // Add points for creating a post
    }
  }

  const handlePostImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewPostImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-200 flex items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>{isSignUp ? "Sign Up for Fashion Fusion" : "Login to Fashion Fusion"}</CardTitle>
            <CardDescription>{isSignUp ? "Create an account to join our community" : "Enter your credentials to access the app"}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Username</label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {isSignUp ? <UserPlus className="mr-2 h-4 w-4" /> : <LogIn className="mr-2 h-4 w-4" />}
                {isSignUp ? "Sign Up" : "Log In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button variant="link" onClick={() => setIsSignUp(!isSignUp)} className="w-full">
              {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-200">
      <header className="p-6 bg-white shadow-md flex justify-between items-center">
        <h1 className="text-3xl font-bold text-purple-800">Fashion Fusion</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Welcome, {currentUser?.username}!</span>
          <Button onClick={handleLogout} variant="outline">
            Log Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4">
        <Tabs defaultValue="explore" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="match">Match Outfits</TabsTrigger>
            <TabsTrigger value="points">Points & Rewards</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="explore">
            <Card>
              <CardHeader>
                <CardTitle>Explore Global Fashion</CardTitle>
                <CardDescription>Discover cultural dress codes from around the world</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                      <SelectItem value="japan">Japan</SelectItem>
                      <SelectItem value="brazil">Brazil</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button disabled={!selectedCountry} onClick={() => addPoints(5)}>Explore Culture</Button>
                </div>
                <AnimatePresence>
                  {selectedCountry && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <img src="/placeholder.svg?height=200&width=200" alt={`${selectedCountry} traditional dress`} className="rounded-lg w-full" />
                      <div>
                        <h3 className="font-semibold mb-2">Traditional Dress of {selectedCountry}</h3>
                        <p>Description of the traditional dress and its cultural significance...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="match">
            <Card>
              <CardHeader>
                <CardTitle>Match Outfits</CardTitle>
                <CardDescription>Upload items and get matched by the AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold mb-2">Upload Your Items</h3>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'top')}
                        className="hidden"
                        ref={fileInputRef}
                        id="top-upload"
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'bottom')}
                        className="hidden"
                        ref={bottomFileInputRef}
                        id="bottom-upload"
                      />
                      <Button onClick={() => fileInputRef.current?.click()}>
                        <Camera className="mr-2 h-4 w-4" /> Upload Top
                      </Button>
                      <Button onClick={() => bottomFileInputRef.current?.click()}>
                        <Camera className="mr-2 h-4 w-4" /> Upload Bottom
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Get Matched</h3>
                    <Button onClick={handleOutfitMatch}>Find a Match</Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-semibold mb-2">Tops</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {clothingItems.filter(item => item.type === 'top').map(item => (
                        <div key={item.id} className="relative">
                          <img src={item.image} alt="Top item" className="rounded-lg w-full h-40 object-cover" />
                          <Badge className="absolute top-2 left-2" style={{backgroundColor: item.color}}>Top</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute -top-2 -right-2"
                            onClick={() => removeClothingItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Bottoms</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {clothingItems.filter(item => item.type === 'bottom').map(item => (
                        <div key={item.id} className="relative">
                          <img src={item.image} alt="Bottom item" className="rounded-lg w-full h-40 object-cover" />
                          <Badge className="absolute top-2 left-2" style={{backgroundColor: item.color}}>Bottom</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute -top-2 -right-2"
                            onClick={() => removeClothingItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <AnimatePresence>
                  {matchedOutfit && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="mt-4"
                    >
                      <h3 className="font-semibold mb-2">Suggested Outfit</h3>
                      <div className="flex space-x-4">
                        <div className="relative w-1/2">
                          <img src={matchedOutfit.top.image} alt="Matched top" className="rounded-lg w-full h-40 object-cover" />
                          <Badge className="absolute top-2 left-2" style={{backgroundColor: matchedOutfit.top.color}}>Top</Badge>
                        </div>
                        <div className="relative w-1/2">
                          <img src={matchedOutfit.bottom.image} alt="Matched bottom" className="rounded-lg w-full h-40 object-cover" />
                          <Badge className="absolute top-2 left-2" style={{backgroundColor: matchedOutfit.bottom.color}}>Bottom</Badge>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="points">
            <Card>
              <CardHeader>
                <CardTitle>Points & Rewards</CardTitle>
                <CardDescription>Earn points by contributing to the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Your Points</h3>
                    <motion.p 
                      className="text-3xl font-bold text-purple-600"
                      key={userPoints}
                      initial={{ scale: 1.5, color: "#9333ea" }}
                      animate={{ scale: 1, color: "#7c3aed" }}
                      transition={{ duration: 0.5 }}
                    >
                      {userPoints}
                    </motion.p>
                    <p className="text-sm text-gray-500">Level: {userLevel}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">How to Earn</h3>
                    <ul className="list-disc list-inside">
                      <li>Match outfits: 10 points</li>
                      <li>Review matches: 5 points</li>
                      <li>Upload items: -20 points</li>
                      <li>Daily login: 5 points</li>
                      <li>Like or comment: 1 point</li>
                      <li>Create a post: 5 points</li>
                      <li>Sign up bonus: 10 points</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Redeem Points</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="community">
            <Card>
              <CardHeader>
                <CardTitle>Community Posts</CardTitle>
                <CardDescription>Share and discover fashion inspiration</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full mb-4">Create Post</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create a New Post</DialogTitle>
                      <DialogDescription>Share your fashion inspiration with the community</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Textarea
                          id="post-content"
                          placeholder="What's on your mind?"
                          className="col-span-4"
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                          id="post-image"
                          type="file"
                          accept="image/*"
                          className="col-span-3"
                          onChange={handlePostImageUpload}
                          ref={postImageInputRef}
                        />
                        <Button onClick={() => postImageInputRef.current?.click()}>
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      {newPostImage && (
                        <img src={newPostImage} alt="Post preview" className="w-full h-40 object-cover rounded-md" />
                      )}
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreatePost}>Post</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <motion.div 
                      key={post.id} 
                      className="border-b pb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar>
                          <AvatarImage src={post.avatar} />
                          <AvatarFallback>{post.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{post.user}</p>
                          <p className="text-sm text-gray-500">{post.timestamp}</p>
                        </div>
                      </div>
                      <p className="mb-2">{post.content}</p>
                      <img src={post.image} alt={`Post by ${post.user}`} className="rounded-lg mb-2 w-full" />
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)}>
                          <Heart className="mr-1 h-4 w-4" /> {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="mr-1 h-4 w-4" /> {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="mr-1 h-4 w-4" /> Share
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Manage your profile and settings</CardDescription>
              </CardHeader>
              <CardContent>
                {currentUser && (
                  <div className="space-y-8">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback>{currentUser.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold">{currentUser.username}</h2>
                        <p className="text-gray-500">{currentUser.bio}</p>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <div>
                        <p className="text-2xl font-bold">{currentUser.followers}</p>
                        <p className="text-gray-500">Followers</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{currentUser.following}</p>
                        <p className="text-gray-500">Following</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{posts.filter(post => post.user === currentUser.username).length}</p>
                        <p className="text-gray-500">Posts</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Your Posts</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {posts
                          .filter(post => post.user === currentUser.username)
                          .map(post => (
                            <img key={post.id} src={post.image} alt={`Post by ${post.user}`} className="rounded-lg w-full h-40 object-cover" />
                          ))
                        }
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Settings className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <section className="text-center mt-12">
          <h2 className="text-2xl font-semibold mb-4">Join Our Fashion Community</h2>
          <div className="flex flex-col sm:flex-row max-w-sm mx-auto">
            <Input type="email" placeholder="Enter your email" className="mb-2 sm:mb-0 sm:rounded-r-none" />
            <Button type="submit" className="sm:rounded-l-none">Subscribe</Button>
          </div>
        </section>
      </main>
    </div>
  )
}

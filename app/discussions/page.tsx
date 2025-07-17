"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MessageCircle, Vote, Users, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import apiWithTransform from "@/lib/api" // API 파일 경로에 맞게 수정

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = ["전체", "고대사", "중세사", "근세사", "근현대사", "조선사", "세계사", "일반"]

  // API에서 토론 데이터 가져오기
  const fetchDiscussions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await apiWithTransform.getDiscussions()
      setDiscussions(data)
    } catch (err) {
      console.error('Failed to fetch discussions:', err)
      setError(err.message || '토론 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiscussions()
  }, [])

  // 수동 새로고침 함수
  const handleRefresh = () => {
    fetchDiscussions()
  }

  // 검색어와 카테고리에 따른 필터링
  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "전체" || discussion.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wine-50 to-brick-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-wine-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Image 
                  src="/Logo.svg" 
                  alt="Agora Logo" 
                  width={32} 
                  height={32}
                />
                <Link href="/">
                  <h1 className="text-2xl font-bold text-wine-800 cursor-pointer">Agora</h1>
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleRefresh} 
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className="border-wine-200 text-wine-600 hover:bg-wine-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  새로고침
                </Button>
                <Link href="/create">
                  <Button className="bg-wine-600 hover:bg-wine-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />새 토론 시작
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Loading Spinner */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-wine-600" />
              <span className="text-wine-600">토론 목록을 불러오는 중...</span>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wine-50 to-brick-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-wine-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Image 
                  src="/Logo.svg" 
                  alt="Agora Logo" 
                  width={32} 
                  height={32}
                />
                <Link href="/">
                  <h1 className="text-2xl font-bold text-wine-800 cursor-pointer">Agora</h1>
                </Link>
              </div>
              <Link href="/create">
                <Button className="bg-wine-600 hover:bg-wine-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />새 토론 시작
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Error Display */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 text-lg font-medium">오류가 발생했습니다</p>
              <p className="text-red-500 mt-2">{error}</p>
              <Button 
                onClick={handleRefresh} 
                className="mt-4 bg-wine-600 hover:bg-wine-700 text-white"
              >
                다시 시도
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wine-50 to-brick-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-wine-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image 
                src="/Logo.svg" 
                alt="Agora Logo" 
                width={32} 
                height={32}
              />
              <Link href="/">
                <h1 className="text-2xl font-bold text-wine-800 cursor-pointer">Agora</h1>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleRefresh} 
                variant="outline"
                size="sm"
                disabled={loading}
                className="border-wine-200 text-wine-600 hover:bg-wine-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
              <Link href="/create">
                <Button className="bg-wine-600 hover:bg-wine-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />새 토론 시작
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="토론 주제를 검색하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-wine-200 focus:border-wine-400"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-wine-600 hover:bg-wine-700 text-white"
                    : "border-wine-200 text-wine-600 hover:bg-wine-50"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Discussion List */}
        <div className="grid gap-6">
          {filteredDiscussions.map((discussion) => (
            <Card key={discussion.id} className="hover:shadow-lg transition-shadow border-wine-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link href={`/discussion/${discussion.id}`}>
                      <CardTitle className="text-xl text-wine-800 hover:text-wine-600 cursor-pointer mb-2">
                        {discussion.title}
                      </CardTitle>
                    </Link>
                    <p className="text-gray-600 mb-3">{discussion.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>작성자: {discussion.author}</span>
                      <span>작성일: {discussion.createdAt}</span>
                      <Badge variant="outline" className="border-wine-300 text-wine-700">
                        {discussion.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MessageCircle className="w-4 h-4" />
                      <span>{discussion.comments}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Vote className="w-4 h-4" />
                      <span>{discussion.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{discussion.participants}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm">
                      <span className="text-green-600 font-medium">찬성 {discussion.votes.agree}</span>
                      <span className="text-gray-400 mx-1">:</span>
                      <span className="text-red-600 font-medium">반대 {discussion.votes.disagree}</span>
                    </div>  
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredDiscussions.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm || selectedCategory !== "전체" 
                ? "검색 결과가 없습니다." 
                : "아직 토론이 없습니다."}
            </p>
            <p className="text-gray-400 mt-2">
              {searchTerm || selectedCategory !== "전체"
                ? "다른 키워드로 검색해보세요."
                : "첫 번째 토론을 시작해보세요!"}
            </p>
            {(!searchTerm && selectedCategory === "전체") && (
              <Link href="/create">
                <Button className="mt-4 bg-wine-600 hover:bg-wine-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />새 토론 시작
                </Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
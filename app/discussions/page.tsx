"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MessageCircle, Vote, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"


const mockDiscussions = [
  {
    id: 1,
    title: "프랑스 혁명은 정당한 혁명이었는가?",
    description: "1789년 프랑스 혁명의 정당성과 그 결과에 대해 토론해봅시다.",
    author: "역사학도",
    createdAt: "2024-01-15",
    category: "근세사",
    comments: 18,
    likes: 24,
    participants: 12,
    votes: { agree: 15, disagree: 9 },
  },
  {
    id: 2,
    title: "조선의 쇄국정책, 옳은 선택이었을까?",
    description: "조선 후기 쇄국정책의 배경과 그 영향에 대한 다양한 관점을 나누어봅시다.",
    author: "한국사연구자",
    createdAt: "2024-01-14",
    category: "조선사",
    comments: 12,
    likes: 31,
    participants: 18,
    votes: { agree: 12, disagree: 19 },
  },
  {
    id: 3,
    title: "콜럼버스의 아메리카 발견, 발견인가 침략인가?",
    description: "1492년 콜럼버스의 아메리카 대륙 도달에 대한 역사적 평가를 논의해봅시다.",
    author: "세계사탐구",
    createdAt: "2024-01-13",
    category: "세계사",
    comments: 9,
    likes: 30,
    participants: 15,
    votes: { agree: 8, disagree: 22 },
  },
]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")

  const categories = ["전체", "고대사", "중세사", "근세사", "근현대사", "조선사", "세계사"]

  const filteredDiscussions = mockDiscussions.filter((discussion) => {
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "전체" || discussion.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

        {filteredDiscussions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
            <p className="text-gray-400 mt-2">다른 키워드로 검색해보세요.</p>
          </div>
        )}
      </main>
    </div>
  )
}

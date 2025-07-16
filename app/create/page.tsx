"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Send } from "lucide-react"

export default function CreateDiscussionPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setIsSubmitting(true)

    // localStorage에 새 토론 저장
    const newDiscussion = {
      title: title.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
    }
    
    localStorage.setItem('newDiscussion', JSON.stringify(newDiscussion))
    
    // 잠시 로딩 효과 후 목록으로 이동
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/discussions')
    }, 1000)
  }

  const handleGoBack = () => {
    if (title.trim() || description.trim()) {
      if (window.confirm("작성 중인 내용이 사라집니다. 정말 돌아가시겠습니까?")) {
        router.push('/discussions')
      }
    } else {
      router.push('/discussions')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" className="mr-4" onClick={handleGoBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>
            <h1 className="text-xl font-bold text-red-800">새 토론 시작</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-2xl text-red-800">토론 주제 등록</CardTitle>
            <p className="text-gray-600">역사적 사건이나 인물에 대한 흥미로운 토론 주제를 제안해주세요.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  토론 제목 *
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 프랑스 혁명은 정당한 혁명이었는가?"
                  className="border-red-200 focus:border-red-400"
                  maxLength={100}
                />
                <p className="text-sm text-gray-500 mt-1">{title.length}/100자</p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  토론 설명 *
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="토론 주제에 대한 배경 설명과 토론 방향을 제시해주세요. 참가자들이 어떤 관점에서 접근해야 할지 안내해주세요."
                  className="min-h-[150px] border-red-200 focus:border-red-400"
                  maxLength={1000}
                />
                <p className="text-sm text-gray-500 mt-1">{description.length}/1000자</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2">토론 가이드라인</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• 상대방의 의견을 존중하며 건설적인 토론을 해주세요</li>
                  <li>• 근거 있는 주장을 위해 참고 자료를 첨부해주세요</li>
                  <li>• 개인 공격이나 감정적인 표현은 자제해주세요</li>
                  <li>• 다양한 관점을 인정하고 열린 마음으로 참여해주세요</li>
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 bg-transparent"
                  onClick={handleGoBack}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={!title.trim() || !description.trim() || isSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
                >
                  {isSubmitting ? (
                    "등록 중..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      토론 시작하기
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
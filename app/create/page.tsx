"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Send, AlertCircle, TestTube, Bug } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import apiWithTransform from "@/lib/api" // API 파일 import (제거 가능)

export default function CreateDiscussionPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [author, setAuthor] = useState("")
  const [category, setCategory] = useState("일반")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [corsDebugInfo, setCorsDebugInfo] = useState("")

  // 공통 요청 데이터 생성 함수
  const createRequestData = (titleValue, descriptionValue, authorValue, categoryValue) => {
    return {
      name: authorValue.trim(),
      title: titleValue.trim(),
      content: descriptionValue.trim(),
      category: categoryValue
    }
  }

  // 공통 fetch 함수
  const makeApiRequest = async (requestData) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://keen-feasible-snake.ngrok-free.app'
    
    console.log('📤 Sending request to:', `${BASE_URL}/api/discussions`)
    console.log('📤 Request data:', requestData)
    
    const response = await fetch(`${BASE_URL}/api/discussions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      mode: 'cors',
      body: JSON.stringify(requestData)
    })
    
    console.log('📥 Response status:', response.status)
    console.log('📥 Response ok:', response.ok)
    
    // 응답 헤더 로깅
    console.log('📋 Response headers:')
    for (let [key, value] of response.headers.entries()) {
      console.log(`   ${key}: ${value}`)
    }
    
    return response
  }

  // CORS 디버깅 함수
  const handleCorsDebug = async () => {
    setIsSubmitting(true)
    setError("")
    setCorsDebugInfo("")

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://keen-feasible-snake.ngrok-free.app'
      const endpoint = `${BASE_URL}/api/discussions`
      
      let debugInfo = `🔍 CORS 디버깅 시작\n`
      debugInfo += `📍 엔드포인트: ${endpoint}\n`
      debugInfo += `🌐 현재 도메인: ${window.location.origin}\n\n`

      // 1. OPTIONS 요청 (Preflight) 테스트
      console.log('🔍 CORS DEBUG: Testing OPTIONS request...')
      debugInfo += `1️⃣ OPTIONS 요청 (Preflight) 테스트:\n`
      
      try {
        const optionsResponse = await fetch(endpoint, {
          method: 'OPTIONS',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          mode: 'cors',
        })
        
        debugInfo += `   ✅ OPTIONS 상태: ${optionsResponse.status}\n`
        console.log('✅ OPTIONS Response:', optionsResponse.status)
        
        // OPTIONS 응답 헤더 확인
        const corsHeaders = {
          'Access-Control-Allow-Origin': optionsResponse.headers.get('Access-Control-Allow-Origin'),
          'Access-Control-Allow-Methods': optionsResponse.headers.get('Access-Control-Allow-Methods'),
          'Access-Control-Allow-Headers': optionsResponse.headers.get('Access-Control-Allow-Headers'),
          'Access-Control-Allow-Credentials': optionsResponse.headers.get('Access-Control-Allow-Credentials'),
        }
        
        debugInfo += `   📋 CORS 헤더들:\n`
        Object.entries(corsHeaders).forEach(([key, value]) => {
          debugInfo += `      ${key}: ${value || '❌ 없음'}\n`
          console.log(`   ${key}:`, value || '❌ 없음')
        })
        
      } catch (optionsError) {
        debugInfo += `   ❌ OPTIONS 요청 실패: ${optionsError.message}\n`
        console.error('❌ OPTIONS Error:', optionsError)
      }

      // 2. 실제 POST 요청 테스트 (현재 폼 값 사용)
      debugInfo += `\n2️⃣ 실제 POST 요청 테스트 (현재 폼 값 사용):\n`
      console.log('🔍 CORS DEBUG: Testing POST request with current form values...')
      
      // 현재 폼 값이 있으면 사용, 없으면 테스트 데이터 사용
      const testData = createRequestData(
        title || "CORS 디버깅 테스트",
        description || "이것은 CORS 디버깅을 위한 테스트 요청입니다.",
        author || "CORS 테스트 사용자",
        category
      )
      
      debugInfo += `   📤 요청 데이터:\n`
      debugInfo += `      name: ${testData.name}\n`
      debugInfo += `      title: ${testData.title}\n`
      debugInfo += `      content: ${testData.content}\n`
      debugInfo += `      category: ${testData.category}\n\n`
      
      const response = await makeApiRequest(testData)
      
      debugInfo += `   ✅ POST 상태: ${response.status}\n`
      console.log('✅ POST Response:', response.status)
      
      // POST 응답 헤더 확인
      const postCorsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Content-Type': response.headers.get('Content-Type'),
      }
      
      debugInfo += `   📋 POST 응답 헤더들:\n`
      Object.entries(postCorsHeaders).forEach(([key, value]) => {
        debugInfo += `      ${key}: ${value || '❌ 없음'}\n`
        console.log(`   POST ${key}:`, value || '❌ 없음')
      })
      
      if (response.ok) {
        const result = await response.json()
        debugInfo += `   ✅ POST 성공! 응답 데이터 확인됨\n`
        console.log('✅ POST Success:', result)
      } else {
        const errorText = await response.text()
        debugInfo += `   ❌ POST 실패: ${errorText}\n`
        console.error('❌ POST Error:', errorText)
      }

      // 3. 브라우저 정보
      debugInfo += `\n3️⃣ 브라우저 정보:\n`
      debugInfo += `   🌐 User Agent: ${navigator.userAgent}\n`
      debugInfo += `   🔒 HTTPS: ${window.location.protocol === 'https:' ? '예' : '아니오'}\n`
      
      setCorsDebugInfo(debugInfo)
      console.log('🔍 CORS DEBUG 완료:', debugInfo)
      
    } catch (error) {
      const errorInfo = `❌ CORS 디버깅 중 오류 발생: ${(error as Error).message}\n`
      setCorsDebugInfo(errorInfo)
      console.error('❌ CORS Debug Error:', error)
      setError(`CORS 디버깅 실패: ${(error as Error).message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // POST 테스트 함수 (현재 폼 값 사용)
  const handleTestPost = async () => {
    setIsSubmitting(true)
    setError("")

    try {
      // 현재 폼 값이 있으면 사용, 없으면 테스트 데이터 사용
      const testData = createRequestData(
        title || "POST 테스트 토론",
        description || "이것은 POST 요청 테스트를 위한 토론입니다.",
        author || "테스트 사용자",
        category
      )
      
      const response = await makeApiRequest(testData)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ TEST: Response error:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const result = await response.json()
      console.log('✅ TEST: Success:', result)
      
      // 성공 알림
      alert('POST 테스트 성공! 콘솔을 확인해보세요.')
      
    } catch (error) {
      console.error('❌ TEST: Error:', error)
      setError(`테스트 실패: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 유효성 검사
    if (!title.trim()) {
      setError("토론 제목을 입력해주세요.")
      return
    }
    if (!description.trim()) {
      setError("토론 설명을 입력해주세요.")
      return
    }
    if (!author.trim()) {
      setError("작성자명을 입력해주세요.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // 테스트 코드와 동일한 형식으로 데이터 생성
      const requestData = createRequestData(title, description, author, category)
      
      const response = await makeApiRequest(requestData)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Response error:', errorText)
        
        if (response.status === 400) {
          throw new Error('요청 데이터가 잘못되었습니다. 모든 필드를 확인해주세요.')
        } else if (response.status === 404) {
          throw new Error('API 엔드포인트를 찾을 수 없습니다.')
        } else if (response.status === 500) {
          throw new Error('서버 내부 오류가 발생했습니다.')
        } else {
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }
      }
      
      const result = await response.json()
      console.log('✅ Discussion created successfully:', result)
      
      // 성공 시 토론 목록 페이지로 이동
      router.push('/discussions')
      
    } catch (error) {
      console.error('❌ Error creating discussion:', error)
      setError(error.message || "토론 생성 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoBack = () => {
    if (title.trim() || description.trim() || author.trim()) {
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
            {error && (
              <Alert className="mb-6 border-red-300 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* CORS 디버깅 정보 표시 */}
            {corsDebugInfo && (
              <Alert className="mb-6 border-blue-300 bg-blue-50">
                <Bug className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {corsDebugInfo}
                  </pre>
                </AlertDescription>
              </Alert>
            )}

            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  작성자명 *
                </label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="작성자명을 입력하세요"
                  className="border-red-200 focus:border-red-400"
                  maxLength={50}
                />
                <p className="text-sm text-gray-500 mt-1">{author.length}/50자</p>
              </div>

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
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-red-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
                >
                  <option value="일반">일반</option>
                  <option value="역사">역사</option>
                  <option value="정치">정치</option>
                  <option value="문화">문화</option>
                  <option value="경제">경제</option>
                  <option value="과학">과학</option>
                  <option value="기타">기타</option>
                </select>
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
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={!title.trim() || !description.trim() || !author.trim() || isSubmitting}
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
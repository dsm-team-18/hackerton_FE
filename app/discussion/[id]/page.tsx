"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Vote,
  Users,
  Send,
  Heart,
  Flag,
  Users as UsersIcon,
} from "lucide-react"
import Link from "next/link"
import api from "../../api" // API 함수들 import

// 타입 정의
interface Discussion {
  id: string
  title: string
  description: string
  author: string
  createdAt: string
  category: string
  voteCounts: { agree: number; disagree: number }
  visitorsCount: number
  userVote?: 'agree' | 'disagree' | null
}

interface Comment {
  id: number
  author: string
  avatar: string
  content: string
  stance: 'agree' | 'disagree' | 'neutral'
  likes: number
  createdAt: string
  references: { title: string; url: string }[]
  isLiked: boolean
}

export default function DiscussionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [discussion, setDiscussion] = useState<Discussion | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 댓글 작성 폼 상태
  const [newComment, setNewComment] = useState("")
  const [commentStance, setCommentStance] = useState<"agree" | "disagree" | "neutral">("neutral")
  const [referenceTitle, setReferenceTitle] = useState("")
  const [referenceNickname, setReferenceNickname] = useState("")
  const [referenceUrl, setReferenceUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 투표 상태
  const [isVoting, setIsVoting] = useState(false)

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 방문자 수 증가
        try {
          await api.incrementVisitor(resolvedParams.id)
        } catch (err) {
          console.warn('방문자 수 증가 실패:', err)
        }
        
        // 토론 상세 정보 가져오기
        const discussionData = await api.getDiscussion(resolvedParams.id)
        setDiscussion(discussionData)
        
        // 댓글 목록 가져오기
        const commentsData = await api.getComments(resolvedParams.id)
        setComments(commentsData)
        
      } catch (err) {
        console.error('데이터 로드 실패:', err)
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [resolvedParams.id])

  // 투표 처리
  const handleVote = async (vote: "agree" | "disagree") => {
    if (!discussion || isVoting) return

    try {
      setIsVoting(true)
      setError(null)
      
      // API 호출
      const result = await api.voteDiscussion(resolvedParams.id, vote)
      
      // 상태 업데이트
      setDiscussion(prev => prev ? {
        ...prev,
        voteCounts: result.voteCounts,
        userVote: result.userVote
      } : null)
      
    } catch (err) {
      console.error('투표 실패:', err)
      setError(err instanceof Error ? err.message : '투표에 실패했습니다.')
    } finally {
      setIsVoting(false)
    }
  }

  // 댓글 작성 처리
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !discussion || isSubmitting) return
    
    try {
      setIsSubmitting(true)
      setError(null)
      
      // 참고자료 파싱
      let references: { title: string; url: string }[] = []
      if (referenceTitle && referenceUrl) {
        const titles = referenceTitle.split(',').map(title => title.trim()).filter(title => title)
        const urls = referenceUrl.split(',').map(url => url.trim()).filter(url => url)
        
        const maxLength = Math.max(titles.length, urls.length)
        for (let i = 0; i < maxLength; i++) {
          references.push({
            title: titles[i] || `참고자료 ${i + 1}`,
            url: urls[i] || '#'
          })
        }
      }

      // API 호출을 위한 데이터 준비
      const commentData = {
        nickname: referenceNickname || "익명",
        content: newComment,
        stance: commentStance,
        references
      }
      
      // 댓글 작성 API 호출
      const newCommentResponse = await api.createComment(resolvedParams.id, commentData)
      
      // 댓글 목록 다시 불러오기
      const updatedComments = await api.getComments(resolvedParams.id)
      setComments(updatedComments)
      
      // 폼 초기화
      setNewComment("")
      setReferenceTitle("")
      setReferenceUrl("")
      setReferenceNickname("")
      setCommentStance("neutral")
      
    } catch (err) {
      console.error('댓글 작성 실패:', err)
      setError(err instanceof Error ? err.message : '댓글 작성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 댓글 좋아요 처리
  const handleCommentLike = async (commentId: number) => {
    try {
      setError(null)
      
      // API 호출
      await api.toggleCommentLike(commentId)
      
      // 로컬 상태 업데이트 (낙관적 업데이트)
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked
            }
          : comment
      ))
      
    } catch (err) {
      console.error('좋아요 처리 실패:', err)
      setError(err instanceof Error ? err.message : '좋아요 처리에 실패했습니다.')
    }
  }

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wine-50 to-brick-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wine-600 mx-auto mb-4"></div>
          <p className="text-wine-600">토론을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wine-50 to-brick-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  // 토론 데이터가 없는 경우
  if (!discussion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wine-50 to-brick-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">토론을 찾을 수 없습니다.</p>
          <Link href="/">
            <Button variant="outline">목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalVotes = discussion.voteCounts.agree + discussion.voteCounts.disagree
  const agreeRate = totalVotes > 0 ? Math.round((discussion.voteCounts.agree / totalVotes) * 100) : 0
  const disagreeRate = totalVotes > 0 ? Math.round((discussion.voteCounts.disagree / totalVotes) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-wine-50 to-brick-50">
      <header className="bg-white shadow-sm border-b border-wine-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
          <Link href="/">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-wine-800">토론 상세</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 에러 메시지 표시 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 토론 정보 카드 */}
        <Card className="border-wine-200">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge variant="outline" className="border-wine-300 text-wine-700">
                {discussion.category}
              </Badge>
              <span className="text-sm text-gray-500">{discussion.createdAt} | {discussion.author}</span>
            </div>
            <CardTitle className="text-2xl text-wine-800 mb-2">{discussion.title}</CardTitle>
            <p className="text-gray-700">{discussion.description}</p>
          </CardHeader>
          <CardContent className="flex gap-6 text-gray-600">
            <div className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{comments.length}</div>
            <div className="flex items-center gap-1"><Vote className="w-4 h-4" />{totalVotes}</div>
            <div className="flex items-center gap-1"><Users className="w-4 h-4" />{discussion.visitorsCount}</div>
          </CardContent>
        </Card>

        {/* 투표 카드 */}
        <Card className="border-wine-200">
          <CardHeader><CardTitle className="text-lg text-wine-800">투표하기</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Button
                variant={discussion.userVote === "agree" ? "default" : "outline"}
                className={`flex-1 ${discussion.userVote === "agree" ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-700 hover:bg-green-50"}`}
                onClick={() => handleVote("agree")}
                disabled={isVoting}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                찬성 ({discussion.voteCounts.agree})
              </Button>
              <Button
                variant={discussion.userVote === "disagree" ? "default" : "outline"}
                className={`flex-1 ${discussion.userVote === "disagree" ? "bg-red-600 hover:bg-red-700" : "border-red-300 text-red-700 hover:bg-red-50"}`}
                onClick={() => handleVote("disagree")}
                disabled={isVoting}
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                반대 ({discussion.voteCounts.disagree})
              </Button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 flex overflow-hidden">
              <div
                className="bg-green-600 h-2 transition-all duration-300"
                style={{ width: `${agreeRate}%` }}
              />
              <div
                className="bg-red-600 h-2 transition-all duration-300"
                style={{ width: `${disagreeRate}%` }}
              />
            </div>  
          </CardContent>
        </Card>

        {/* 댓글 작성 카드 */}
        <Card className="border-wine-200">
          <CardHeader><CardTitle className="text-lg text-wine-800">의견 작성</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={() => setCommentStance("agree")} variant={commentStance === "agree" ? "default" : "outline"} className={commentStance === "agree" ? "bg-green-600 hover:bg-green-700" : ""}>찬성</Button>
              <Button onClick={() => setCommentStance("disagree")} variant={commentStance === "disagree" ? "default" : "outline"} className={commentStance === "disagree" ? "bg-red-600 hover:bg-red-700" : ""}>반대</Button>
              <Button onClick={() => setCommentStance("neutral")} variant={commentStance === "neutral" ? "default" : "outline"} className={commentStance === "neutral" ? "bg-gray-600 hover:bg-gray-700" : ""}>중립</Button>
            </div>
            <Textarea
              placeholder="여러분의 의견을 자유롭게 작성해주세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[120px] border-wine-200"
              disabled={isSubmitting}
            />
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="닉네임" 
                  value={referenceNickname} 
                  onChange={(e) => setReferenceNickname(e.target.value)}
                  disabled={isSubmitting}
                />
                <Input 
                  placeholder="참고 자료 제목" 
                  value={referenceTitle} 
                  onChange={(e) => setReferenceTitle(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <Input 
                placeholder="참고 자료 URL" 
                value={referenceUrl} 
                onChange={(e) => setReferenceUrl(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <Button 
              onClick={handleSubmitComment} 
              className="bg-wine-600 hover:bg-wine-700" 
              disabled={!newComment.trim() || isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? '등록 중...' : '의견 등록'}
            </Button>
          </CardContent>
        </Card>

        {/* 댓글 목록 */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-wine-800">의견 ({comments.length})</h2>
          {comments.length === 0 ? (
            <Card className="border-wine-200">
              <CardContent className="pt-6 text-center text-gray-500">
                아직 등록된 의견이 없습니다. 첫 번째 의견을 남겨보세요!
              </CardContent>
            </Card>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="border-wine-200">
                <CardContent className="pt-6 flex gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-wine-100 text-wine-800">{comment.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex gap-2 items-center">
                      <span className="font-medium text-wine-800">{comment.author}</span>
                      <Badge
                        className={
                          comment.stance === "agree"
                            ? "bg-green-100 text-green-700"
                            : comment.stance === "disagree"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {comment.stance === "agree" ? "찬성" : comment.stance === "disagree" ? "반대" : "중립"}
                      </Badge>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                    
                    {comment.references.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {comment.references.map((ref, idx) => (
                            <a 
                              key={idx}
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                            >
                              <Flag className="w-4 h-4 text-red-600" />
                              <span className="text-sm text-red-700 font-medium">{ref.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCommentLike(comment.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-200 ${
                            comment.isLiked
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm font-medium">{comment.likes}</span>
                        </button>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </main>
    </div>
  )
}
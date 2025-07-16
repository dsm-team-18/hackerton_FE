// API 함수들
const api = {
  // 토론 리스트 조회
  getDiscussions: async () => {
    const response = await fetch('/api/discussions')
    if (!response.ok) {
      throw new Error('Failed to fetch discussions')
    }
    return response.json()
  },

  // 토론 상세 정보 가져오기
  getDiscussion: async (discussionId) => {
    const response = await fetch(`/api/discussions/${discussionId}`)
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('토론을 찾을 수 없습니다')
      }
      if (response.status === 204) {
        throw new Error('조회할 토론이 없습니다')
      }
      throw new Error('Failed to fetch discussion')
    }
    return response.json()
  },

  // 토론 작성하기
  createDiscussion: async (name) => {
    const response = await fetch('/api/discussions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('잘못된 요청입니다')
      }
      throw new Error('Failed to create discussion')
    }
    return response.json()
  },

  // 토론 투표하기
  voteDiscussion: async (discussionId, isAgree) => {
    const response = await fetch(`/api/discussions/${discussionId}/vote?agree=${isAgree}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('잘못된 요청입니다')
      }
      if (response.status === 404) {
        throw new Error('토론을 찾을 수 없습니다')
      }
      throw new Error('Failed to vote')
    }
    return response.json()
  },

  // 댓글 작성하기 (API 명세에 없지만 기존 코드에 맞춰 추가)
  createComment: async (discussionId, commentData) => {
    const response = await fetch(`/api/discussions/${discussionId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: commentData.nickname,
        content: commentData.content,
        agree: commentData.stance === 'agree' ? 'AGREE' : 
               commentData.stance === 'disagree' ? 'DISAGREE' : 'NEUTRAL',
        references: commentData.references.map(ref => ({
          reference_title: ref.title,
          reference_url: ref.url
        }))
      })
    })
    if (!response.ok) {
      throw new Error('Failed to create comment')
    }
    return response.json()
  },

  // 댓글 좋아요 토글 (API 명세에 없지만 기존 코드에 맞춰 추가)
  toggleCommentLike: async (commentId) => {
    const response = await fetch(`/api/comments/${commentId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) {
      throw new Error('Failed to toggle like')
    }
    return response.json()
  },

  // 방문자 수 증가 (API 명세에 없지만 기존 코드에 맞춰 추가)
  incrementVisitor: async (discussionId) => {
    const response = await fetch(`/api/discussions/${discussionId}/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) {
      throw new Error('Failed to increment visitor')
    }
    return response.json()
  }
}

// 데이터 변환 유틸리티 함수들
const transformers = {
  // API 응답을 프론트엔드 형식으로 변환
  transformDiscussionList: (apiResponse) => {
    return apiResponse.posts.map(post => ({
      id: post.id, // API 명세에 없지만 필요할 것으로 추정
      title: post.title,
      description: post.content,
      author: post.writer,
      createdAt: new Date(post.created_at).toLocaleDateString(),
      category: post.category || '일반',
      commentCount: post.comment_count,
      voteCount: post.vote_count,
      visitorsCount: post.read_count
    }))
  },

  // 토론 상세 API 응답을 프론트엔드 형식으로 변환
  transformDiscussion: (apiResponse) => {
    return {
      id: apiResponse.id, // API 명세에 없지만 필요할 것으로 추정
      title: apiResponse.title,
      description: apiResponse.content,
      author: apiResponse.writer,
      createdAt: new Date(apiResponse.created_at).toLocaleDateString(),
      category: apiResponse.category || '일반',
      voteCounts: {
        agree: apiResponse.agree_count,
        disagree: apiResponse.disagree_count
      },
      visitorsCount: apiResponse.read_count,
      userVote: null // 사용자 투표 상태는 별도 API가 필요할 것으로 추정
    }
  },

  // 댓글 API 응답을 프론트엔드 형식으로 변환
  transformComments: (apiComments) => {
    return apiComments.map(comment => ({
      id: comment.id, // API 명세에 없지만 필요할 것으로 추정
      author: comment.name,
      avatar: comment.name.charAt(0),
      content: comment.content,
      stance: comment.agree === 'AGREE' ? 'agree' : 
              comment.agree === 'DISAGREE' ? 'disagree' : 'neutral',
      likes: comment.like_count,
      createdAt: comment.created_at,
      references: comment.references || [],
      isLiked: false // 사용자 좋아요 상태는 별도 API가 필요할 것으로 추정
    }))
  },

  // 투표 요청을 API 형식으로 변환
  transformVoteRequest: (vote) => {
    return vote === 'agree'
  }
}

// 통합된 API 함수들 (데이터 변환 포함)
const apiWithTransform = {
  // 토론 리스트 조회 (변환 포함)
  getDiscussions: async () => {
    const response = await api.getDiscussions()
    return transformers.transformDiscussionList(response)
  },

  // 토론 상세 정보 가져오기 (변환 포함)
  getDiscussion: async (discussionId) => {
    const response = await api.getDiscussion(discussionId)
    return transformers.transformDiscussion(response)
  },

  // 댓글 목록 가져오기 (토론 상세에 포함되어 있음)
  getComments: async (discussionId) => {
    const response = await api.getDiscussion(discussionId)
    return transformers.transformComments(response.comments)
  },

  // 토론 투표하기 (변환 포함)
  voteDiscussion: async (discussionId, vote) => {
    const isAgree = transformers.transformVoteRequest(vote)
    const response = await api.voteDiscussion(discussionId, isAgree)
    
    // 응답 형식이 명세에 없으므로 추정
    return {
      voteCounts: {
        agree: response.agree_count,
        disagree: response.disagree_count
      },
      userVote: vote
    }
  },

  // 나머지 함수들은 그대로 사용
  createDiscussion: api.createDiscussion,
  createComment: api.createComment,
  toggleCommentLike: api.toggleCommentLike,
  incrementVisitor: api.incrementVisitor
}

export default apiWithTransform
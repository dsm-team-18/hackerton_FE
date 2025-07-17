const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://keen-feasible-snake.ngrok-free.app'

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
})

const getFetchOptions = (method = 'GET', body = null) => ({
    method,
    headers: getHeaders(),
    ...(body && {body: JSON.stringify(body)})
})

const api = {
    // 토론 리스트 조회
    getDiscussions: async () => {
        const response = await fetch(`${BASE_URL}/api/discussions/list`, getFetchOptions())

        if (!response.ok) {
            if (response.status === 204) return {posts: []}
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return response.json()
    },

    // 토론 상세 정보 가져오기
    getDiscussion: async (discussionId) => {
        const response = await fetch(`${BASE_URL}/api/discussions/${discussionId}`, getFetchOptions())

        if (!response.ok) {
            if (response.status === 404) throw new Error('토론을 찾을 수 없습니다')
            throw new Error(`Failed to fetch discussion: ${response.status}`)
        }

        return response.json()
    },

    // 토론 작성하기
    createDiscussion: async (discussionData) => {
        const payload = {
            name: discussionData.name,
            title: discussionData.title,
            content: discussionData.content,
            category: discussionData.category || '일반'
        }

        const response = await fetch(`${BASE_URL}/api/discussions`, getFetchOptions('POST', payload))

        if (!response.ok) {
            if (response.status === 400) throw new Error('잘못된 요청입니다. 필수 항목을 확인해주세요.')
            if (response.status === 500) throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
            throw new Error(`Failed to create discussion: ${response.status}`)
        }

        return response.json()
    },

    // 토론 투표하기
    voteDiscussion: async (discussionId, isAgree) => {
        const response = await fetch(`${BASE_URL}/api/discussions/${discussionId}/vote?agree=${isAgree}`, getFetchOptions('PATCH'))

        if (!response.ok) {
            if (response.status === 404) throw new Error('토론을 찾을 수 없습니다')
            throw new Error(`Failed to vote: ${response.status}`)
        }

        // 응답 본문이 비어있는지 확인
        const text = await response.text()
        console.log('Vote response text:', text) // 디버깅용

        if (!text) {
            // 빈 응답인 경우 토론 정보를 다시 가져와서 최신 투표 수 반환
            console.log('Empty response, fetching discussion data...')
            const discussionResponse = await fetch(`${BASE_URL}/api/discussions/${discussionId}`, getFetchOptions())
            if (discussionResponse.ok) {
                const discussionText = await discussionResponse.text()
                if (discussionText) {
                    const discussionData = JSON.parse(discussionText)
                    return {
                        agree_count: discussionData.agree_count || 0,
                        disagree_count: discussionData.disagree_count || 0,
                        success: true
                    }
                }
            }
            // 토론 정보 가져오기도 실패한 경우 기본값 반환
            return {agree_count: 0, disagree_count: 0, success: true}
        }

        try {
            const data = JSON.parse(text)
            return {
                agree_count: data.agree_count || data.agreeCount || 0,
                disagree_count: data.disagree_count || data.disagreeCount || 0,
                success: true,
                ...data
            }
        } catch (error) {
            console.error('JSON parsing error:', error)
            console.error('Response text:', text)

            // JSON 파싱 실패 시 토론 정보를 다시 가져와서 최신 투표 수 반환
            try {
                const discussionResponse = await fetch(`${BASE_URL}/api/discussions/${discussionId}`, getFetchOptions())
                if (discussionResponse.ok) {
                    const discussionText = await discussionResponse.text()
                    if (discussionText) {
                        const discussionData = JSON.parse(discussionText)
                        return {
                            agree_count: discussionData.agree_count || 0,
                            disagree_count: discussionData.disagree_count || 0,
                            success: true
                        }
                    }
                }
            } catch (fallbackError) {
                console.error('Fallback error:', fallbackError)
            }

            return {agree_count: 0, disagree_count: 0, success: true}
        }
    },

    // 댓글 작성하기
    createComment: async (discussionId, commentData) => {
        const payload = {
            name: commentData.nickname,
            content: commentData.content,
            agree: commentData.stance === 'agree' ? 'AGREE' :
                commentData.stance === 'disagree' ? 'DISAGREE' : 'NEUTRAL',
            references: commentData.references.map(ref => ({
                reference_title: ref.title,
                reference_url: ref.url
            }))
        }

        const response = await fetch(`${BASE_URL}/api/discussions/${discussionId}/comments`, getFetchOptions('PATCH', payload))

        if (!response.ok) {
            throw new Error(`Failed to create comment: ${response.status}`)
        }

        const text = await response.text()
        if (!text) {
            return {success: true}
        }

        try {
            return JSON.parse(text)
        } catch (error) {
            console.error('JSON parsing error:', error)
            return {success: true}
        }
    },

    // 댓글 좋아요 토글
    toggleCommentLike: async (commentId) => {
        const response = await fetch(`${BASE_URL}/api/comments/${commentId}/like`, getFetchOptions('POST'))

        if (!response.ok) {
            throw new Error(`Failed to toggle like: ${response.status}`)
        }

        const text = await response.text()
        if (!text) {
            return {success: true}
        }

        try {
            return JSON.parse(text)
        } catch (error) {
            console.error('JSON parsing error:', error)
            return {success: true}
        }
    },

    // 방문자 수 증가
    incrementVisitor: async (discussionId) => {
        const response = await fetch(`${BASE_URL}/api/discussions/${discussionId}/visit`, getFetchOptions('POST'))

        if (!response.ok) {
            throw new Error(`Failed to increment visitor: ${response.status}`)
        }

        const text = await response.text()
        if (!text) {
            return {success: true}
        }

        try {
            return JSON.parse(text)
        } catch (error) {
            console.error('JSON parsing error:', error)
            return {success: true}
        }
    }
}

// 데이터 변환 함수들
const transformers = {
    // 토론 리스트 변환
    transformDiscussionList: (apiResponse) => {
        if (!apiResponse) return []

        return apiResponse.map(post => ({
            id: post.id,
            title: post.title || '제목 없음',
            description: post.content || '내용 없음',
            author: post.writer || '작성자 미상',
            createdAt: post.created_at ? new Date(post.created_at).toLocaleDateString('ko-KR') : '날짜 미상',
            category: '일반',
            comments: post.comment_count || 0,
            likes: post.vote_count || 0,
            participants: post.read_count || 0,
            votes: {
                agree: post.agree_count | 0,
                disagree: post.disagree_count | 0
            },
            voteCounts: (post.agree_count + post.disagree_count) || 0,
        }))
    },

    // 토론 상세 변환
    transformDiscussion: (apiResponse) => {
        if (!apiResponse) throw new Error('API response is null or undefined')

        return {
            id: apiResponse.id,
            title: apiResponse.title || '제목 없음',
            description: apiResponse.content || '내용 없음',
            author: apiResponse.writer || '작성자 미상',
            createdAt: apiResponse.created_at ? new Date(apiResponse.created_at).toLocaleDateString('ko-KR') : '날짜 미상',
            category: apiResponse.category || '일반',
            comments: apiResponse.comment_count || 0,
            likes: apiResponse.vote_count || 0,
            participants: apiResponse.read_count || 0,
            votes: {
                agree: apiResponse.agree_count || 0,
                disagree: apiResponse.disagree_count || 0
            },
            userVote: null,
            voteCounts: (apiResponse.agree_count || 0) + (apiResponse.disagree_count || 0),
        }
    },

    // 댓글 변환
    transformComments: (apiComments) => {
        if (!apiComments || !Array.isArray(apiComments)) return []

        return apiComments.map(comment => ({
            id: comment.id,
            author: comment.name || '익명',
            avatar: (comment.name || '익명').charAt(0),
            content: comment.content || '',
            stance: comment.agree === 'AGREE' ? 'agree' :
                comment.agree === 'DISAGREE' ? 'disagree' : 'neutral',
            likes: comment.like_count || 0,
            createdAt: comment.created_at ? new Date(comment.created_at).toLocaleDateString('ko-KR') : '날짜 미상',
            references: comment.references || [],
            isLiked: false
        }))
    }
}

// 통합 API (데이터 변환 포함)
const apiWithTransform = {
    getDiscussions: async () => {
        const response = await api.getDiscussions()
        return transformers.transformDiscussionList(response)
    },

    getDiscussion: async (discussionId) => {
        const response = await api.getDiscussion(discussionId)
        return transformers.transformDiscussion(response)
    },

    createDiscussion: async (discussionData) => {
        const response = await api.createDiscussion(discussionData)
        return transformers.transformDiscussion(response)
    },

    getComments: async (discussionId) => {
        const response = await api.getDiscussion(discussionId)
        return transformers.transformComments(response.comments)
    },

    voteDiscussion: async (discussionId, vote) => {
        const isAgree = vote === 'agree'

        try {
            const response = await api.voteDiscussion(discussionId, isAgree)

            // 응답 데이터 검증 및 안전한 처리
            const result = {
                votes: {
                    agree: Number(response.agree_count || response.agreeCount || 0),
                    disagree: Number(response.disagree_count || response.disagreeCount || 0)
                },
                userVote: vote,
                voteCounts: Number(response.agree_count) + Number(response.disagree_count) || 0
            }

            // 투표 수가 음수가 아닌지 확인
            if (result.votes.agree < 0) result.votes.agree = 0
            if (result.votes.disagree < 0) result.votes.disagree = 0

            return result
        } catch (error) {
            console.error('Vote API error:', error)

            // API 오류 시 현재 토론 정보를 다시 가져와서 최신 투표 수 반환
            try {
                const discussionResponse = await api.getDiscussion(discussionId)
                return {
                    votes: {
                        agree: Number(discussionResponse.agree_count || 0),
                        disagree: Number(discussionResponse.disagree_count || 0)
                    },
                    userVote: vote,
                    voteCounts: Number(discussionResponse.agree_count) + Number(discussionResponse.disagree_count) || 0
                }
            } catch (fallbackError) {
                console.error('Fallback discussion fetch error:', fallbackError)
                // 모든 시도가 실패한 경우 기본값 반환
                return {
                    votes: {
                        agree: 0,
                        disagree: 0
                    },
                    userVote: vote,
                    voteCounts: 0
                }
            }
        }
    },

    createComment: api.createComment,
    toggleCommentLike: api.toggleCommentLike,
    incrementVisitor: api.incrementVisitor
}

export default apiWithTransform
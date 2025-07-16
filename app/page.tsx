"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Users, Vote, BookOpen, TrendingUp, Shield, Zap, ArrowRight, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

const featuredDiscussions = [
  {
    id: 1,
    title: "프랑스 혁명은 정당한 혁명이었는가?",
    category: "근세사",
    participants: 24,
    votes: { agree: 15, disagree: 9 },
    trending: true,
  },
  {
    id: 2,
    title: "조선의 쇄국정책, 옳은 선택이었을까?",
    category: "조선사",
    participants: 18,
    votes: { agree: 12, disagree: 19 },
    trending: false,
  },
  {
    id: 3,
    title: "콜럼버스의 아메리카 발견, 발견인가 침략인가?",
    category: "세계사",
    participants: 15,
    votes: { agree: 8, disagree: 22 },
    trending: true,
  },
]

const features = [
  {
    icon: MessageCircle,
    title: "활발한 토론",
    description: "역사적 사건에 대한 다양한 관점을 자유롭게 나누고 토론하세요",
  },
  {
    icon: Vote,
    title: "민주적 투표",
    description: "1인 1표 시스템으로 공정하고 투명한 의견 수렴이 가능합니다",
  },
  {
    icon: BookOpen,
    title: "근거 기반 토론",
    description: "참고 자료를 첨부하여 더욱 깊이 있는 토론을 진행하세요",
  },
  {
    icon: Users,
    title: "커뮤니티",
    description: "역사를 사랑하는 사람들과 함께 지식을 나누고 성장하세요",
  },
]

const stats = [
  { label: "활성 토론", value: "150+", icon: MessageCircle },
  { label: "참여 학생", value: "2,400+", icon: Users },
  { label: "작성된 의견", value: "8,900+", icon: Vote },
  { label: "공유된 자료", value: "1,200+", icon: BookOpen },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const scaleOnHover = {
  hover: { scale: 1.05, transition: { duration: 0.2 } }
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wine-50 to-brick-50">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md border-b border-wine-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center ">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center "
              >
                <Image 
                  src="/Logo.svg" 
                  alt="Agora Logo" 
                  width={32} 
                  height={32}
                />
                <h1 className="text-2xl font-bold text-wine-800">
                  Agora
                </h1>
              </motion.div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/discussions">
                <motion.div whileHover={scaleOnHover.hover}>
                  <Button variant="ghost" className="text-wine-700 hover:text-wine-800">
                    토론 둘러보기
                  </Button>
                </motion.div>
              </Link>
              <Link href="/create">
                <motion.div whileHover={scaleOnHover.hover}>
                  <Button className="bg-wine-600 hover:bg-wine-700 text-white">토론 시작하기</Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-wine-100 text-wine-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Zap className="w-4 h-4" />
              학생들을 위한 역사 토론 플랫폼
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl lg:text-6xl font-bold text-wine-900 mb-6"
            >
              역사를 통해
              <br />
              <span className="text-wine-600">생각하는 힘</span>을 기르세요
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              다양한 역사적 사건에 대해 토론하고, 서로 다른 관점을 나누며,
              <br />
              비판적 사고력과 논리적 표현력을 다함께 키워나가는 공간입니다.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/discussions">
                <motion.div whileHover={scaleOnHover.hover}>
                  <Button size="lg" className="bg-wine-600 hover:bg-wine-700 text-white px-8 py-3 text-lg">
                    지금 토론 참여하기
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="#features">
                <motion.div whileHover={scaleOnHover.hover}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-wine-300 text-wine-700 hover:bg-wine-50 px-8 py-3 text-lg bg-transparent"
                  >
                    더 알아보기
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-40 bg-white/50 mt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-wine-100 rounded-lg mb-4">
                  <stat.icon className="w-6 h-6 text-wine-600" />
                </div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-3xl font-bold text-wine-800 mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-40 mt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-wine-900 mb-4">왜 Agora인가요?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Agora는 고대 그리스에 존재했던 민주주의의 시초와도 같은 토론 기구입니다.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className="border-wine-200 hover:shadow-lg transition-shadow h-full">
                  <CardHeader className="text-center">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-wine-100 rounded-lg mb-4 mx-auto"
                    >
                      <feature.icon className="w-8 h-8 text-wine-600" />
                    </motion.div>
                    <CardTitle className="text-wine-800">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-40 bg-white/50 mt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-wine-900 mb-4">어떻게 참여하나요?</h2>
            <p className="text-xl text-gray-600">간단한 3단계로 역사 토론에 참여할 수 있습니다.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                number: 1,
                title: "토론 주제 선택",
                description: "관심 있는 역사적 사건이나 인물에 대한 토론을 찾아보세요. 시대별, 주제별로 분류되어 있어 쉽게 찾을 수 있습니다."
              },
              {
                number: 2,
                title: "투표 및 의견 작성",
                description: "찬성 또는 반대 입장을 선택하고, 근거와 함께 자신의 의견을 작성해보세요. 참고 자료도 함께 첨부할 수 있습니다."
              },
              {
                number: 3,
                title: "토론 참여",
                description: "다른 참가자들의 의견을 읽고 댓글을 달거나 좋아요를 눌러 활발한 토론에 참여해보세요."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-wine-600 text-white rounded-full text-2xl font-bold mb-6"
                >
                  {step.number}
                </motion.div>
                <h3 className="text-xl font-bold text-wine-800 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Discussions */}
      <section className="py-40 mt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-wine-900 mb-4">지금 뜨거운 토론</h2>
            <p className="text-xl text-gray-600">현재 가장 활발하게 진행되고 있는 역사 토론들을 확인해보세요.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            className="grid md:grid-cols-3 gap-6"
          >
            {featuredDiscussions.map((discussion, index) => (
              <motion.div
                key={discussion.id}
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <Card className="border-wine-200 hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="border-wine-300 text-wine-700">
                        {discussion.category}
                      </Badge>
                      {discussion.trending && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex items-center gap-1 text-orange-600"
                        >
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">인기</span>
                        </motion.div>
                      )}
                    </div>
                    <CardTitle className="text-wine-800 leading-tight">{discussion.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{discussion.participants}명 참여</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-green-600 font-medium">찬성 {discussion.votes.agree}</span>
                        <span className="text-gray-400 mx-1">:</span>
                        <span className="text-red-600 font-medium">반대 {discussion.votes.disagree}</span>
                      </div>
                    </div>
                    <Link href={`/discussion/${discussion.id}`}>
                      <motion.div whileHover={scaleOnHover.hover}>
                        <Button
                          variant="outline"
                          className="w-full border-wine-300 text-wine-700 hover:bg-wine-50 bg-transparent"
                        >
                          토론 참여하기
                        </Button>
                      </motion.div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: false }}
            className="text-center mt-12"
          >
            <Link href="/discussions">
              <motion.div whileHover={scaleOnHover.hover}>
                <Button size="lg" className="bg-wine-600 hover:bg-wine-700 text-white">
                  모든 토론 보기
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-40 bg-gradient-to-r from-wine-600 to-brick-600 text-white mt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">역사토론광장에서 얻을 수 있는 것들</h2>
            <p className="text-xl text-wine-100">단순한 토론을 넘어 진정한 학습 경험을 제공합니다.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Target,
                title: "비판적 사고력 향상",
                description: "다양한 관점에서 역사적 사건을 분석하고 평가하는 능력을 기를 수 있습니다."
              },
              {
                icon: MessageCircle,
                title: "논리적 표현력 개발",
                description: "자신의 의견을 논리적으로 정리하고 설득력 있게 표현하는 방법을 배웁니다."
              },
              {
                icon: Shield,
                title: "역사적 통찰력 증진",
                description: "과거와 현재를 연결하여 생각하고, 역사의 교훈을 현재에 적용하는 능력을 키웁니다."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-lg mb-6"
                >
                  <benefit.icon className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-wine-100">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 mt-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-wine-900 mb-6">지금 바로 역사 토론에 참여해보세요!</h2>
            <p className="text-xl text-gray-600 mb-8">
              수많은 학생들이 이미 역사토론광장에서 함께 배우고 성장하고 있습니다.
              <br />
              여러분도 지금 시작해보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/discussions">
                <motion.div whileHover={scaleOnHover.hover}>
                  <Button size="lg" className="bg-wine-600 hover:bg-wine-700 text-white px-8 py-3 text-lg">
                    토론 둘러보기
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/create">
                <motion.div whileHover={scaleOnHover.hover}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-wine-300 text-wine-700 hover:bg-wine-50 px-8 py-3 text-lg bg-transparent"
                  >
                    새 토론 시작하기
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false }}
        className="bg-wine-900 text-white py-8 mt-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-3">역사토론광장</h3>
              <p className="text-wine-200 text-sm">
                학생들을 위한 역사 토론 플랫폼으로, 비판적 사고력과 논리적 표현력을 기르는 공간입니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">토론 카테고리</h4>
              <ul className="space-y-1 text-wine-200 text-sm">
                <li>고대사</li>
                <li>중세사</li>
                <li>근세사</li>
                <li>근현대사</li>
                <li>조선사</li>
                <li>세계사</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">이용 안내</h4>
              <ul className="space-y-1 text-wine-200 text-sm">
                <li>토론 참여 방법</li>
                <li>커뮤니티 가이드라인</li>
                <li>자주 묻는 질문</li>
                <li>문의하기</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">정보</h4>
              <ul className="space-y-1 text-wine-200 text-sm">
                <li>서비스 소개</li>
                <li>개인정보처리방침</li>
                <li>이용약관</li>
                <li>공지사항</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-wine-800 mt-6 pt-6 text-center text-wine-200">
            <p className="text-sm">&copy; 2024 역사토론광장. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
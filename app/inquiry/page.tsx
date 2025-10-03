// app/inquiry/page.tsx
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function InquiryPage() {
  return (
    <>
      <BackgroundVideo overlayOpacity={0.85} />
      <main className="relative mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide uppercase mb-10">
          문의하기
        </h1>

        {/* 쉬르밴드 소개 */}
        <div className="space-y-6 mb-12">
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium">
            &lsquo;쉬르밴드&rsquo;는 길이요 진리이며 영원한 왕이신 예수그리스도만을 높이고 주님의 교회와 개인의 삶에 예배가 회복되길(행 15:16) 기도하며 나아갑니다.
          </p>
          
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium">
            복음의 능력을 믿으며(롬1:16) 영원토록 예배받으실 분은 한 분이시며(계5:12-13) 다시 오실 영원한 왕을 바라보며(계22:20) 예수그리스도 안에서 모든 민족이 하나님께로 돌아오고 진정한 예배가 회복 될 것을 믿음으로 바라보고 참된 복음 안에서 삼위일체 하나님을 예배하며 선포하는 사역을 합니다.
          </p>
          
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium">
            쉬르밴드 사역에 대해 궁금한 점이 있으시거나<br />
            사역요청이 필요하시면 아래를 통해 연락 바랍니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* 연락처 정보 */}
          <section className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-normal mb-6">
              연락처 정보
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">이메일</h3>
                <p className="text-base text-white/90">
                  <a href="mailto:shirband2025@gmail.com" className="hover:text-white transition-colors">
                    shirband2025@gmail.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">전화</h3>
                <div className="space-y-2">
                  <p className="text-base text-white/90">
                    <a href="tel:+82-10-5738-0570" className="hover:text-white transition-colors">
                      010-5738-0570
                    </a>
                  </p>
                  <p className="text-base text-white/90">
                    <a href="tel:+82-10-4003-4442" className="hover:text-white transition-colors">
                      010-4003-4442
                    </a>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">소셜미디어</h3>
                <div className="space-y-2">
                  <p className="text-base text-white/90">
                    Instagram: <a href="https://www.instagram.com/shir_band/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline">@shir_band</a>
                  </p>
                  <p className="text-base text-white/90">
                    YouTube: <a href="https://www.youtube.com/@SHIRBAND" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline">@SHIRBAND</a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 문의 양식 */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-normal mb-6">
              문의 양식
            </h2>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="성함을 입력해 주세요"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  이메일 *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="이메일을 입력해 주세요"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="문의 제목을 입력해 주세요"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                  메시지 *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent resize-none"
                  placeholder="문의 내용을 자세히 적어 주세요"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                문의하기
              </button>
            </form>
          </section>
        </div>

        <div className="mt-16 p-6 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-lg font-bold text-white mb-3">
            문의 시 참고사항
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>• 일반적인 문의는 2-3일 내에 답변드립니다.</li>
            <li>• 초청사역 관련 문의는 최소 1개월 전에 연락해 주세요.</li>
            <li>• 급한 문의사항은 전화로 연락해 주시기 바랍니다.</li>
            <li>• 스팸 메일 방지를 위해 문의 내용을 구체적으로 작성해 주세요.</li>
          </ul>
        </div>
      </main>
    </>
  );
}

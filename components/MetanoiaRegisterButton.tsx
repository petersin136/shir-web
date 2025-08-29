import Link from 'next/link';

export function MetanoiaRegisterButton() {
  return (
    <Link
      href="/metanoia-2026#register-section"
      className="w-full border border-white px-6 py-3 text-sm sm:text-base rounded-lg hover:bg-white hover:text-black transition-colors text-center block"
    >
      컨퍼런스 신청하기
    </Link>
  );
}


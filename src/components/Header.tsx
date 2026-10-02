export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[clamp(1rem,3vw,2.5rem)] py-4 text-white mix-blend-difference pointer-events-none">
      <a
        href="#top"
        className="pointer-events-auto display !text-2xl !font-bold tracking-[0.04em]"
      >
        Thủy Trận
      </a>
      <a
        href="#nhan-lenh"
        className="pointer-events-auto group flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase"
      >
        <span>Nhận lệnh</span>
        <span className="inline-block size-2 rotate-45 bg-current transition-transform duration-500 group-hover:rotate-[225deg] group-hover:scale-150" />
      </a>
    </header>
  )
}

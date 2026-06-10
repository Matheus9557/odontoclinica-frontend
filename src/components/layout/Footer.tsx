export function Footer() {
  return (
    <footer className="w-full bg-[#324F7B] flex items-center justify-center py-4">
      <p className="text-sm text-gray-100">
        © {new Date().getFullYear()} OralSync. Todos os direitos reservados.
      </p>
    </footer>
  )
}

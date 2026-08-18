export function Footer() {
  return (
    <footer className="w-full bg-sidebar border-t border-sidebar-border flex items-center justify-center py-4">
      <p className="text-sm text-sidebar-foreground">
        © {new Date().getFullYear()} OralSync. Todos os direitos reservados.
      </p>
    </footer>
  );
}
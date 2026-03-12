export function useSidebar() {
  const isOpen = useState('sidebar-open', () => false)

  function toggle() {
    isOpen.value = !isOpen.value
  }

  function close() {
    isOpen.value = false
  }

  return { isOpen, toggle, close }
}

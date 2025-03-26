import { ref } from 'vue'
const leftDrawerOpen = ref(false)

export default () => {
    function toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
    }
    return {
        leftDrawerOpen,
        toggleLeftDrawer
    }
}

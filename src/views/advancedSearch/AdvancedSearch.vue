<template>
    <div>
        <tree-chart></tree-chart>
    </div>
</template>

<script>
export default {
    name: 'AdvancedSearch',
    components: {
        TreeChart: () => import('./TreeChart')
    }
};
</script>

<style scoped>
</style>

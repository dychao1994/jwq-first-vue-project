<template>
    <div class="liu-yao">
        <liu-yao-search></liu-yao-search>
        <gua></gua>
    </div>
</template>

<script>
export default {
    name: 'LiuYao',
    components: {
        Gua: () => import('./components/Gua'),
        LiuYaoSearch: () => import('./LiuYaoSearch')
    }
};
</script>

<style lang="scss" scoped>
    .liu-yao{

    }
</style>

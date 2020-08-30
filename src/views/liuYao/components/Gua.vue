<template>
    <div class="gua">
        <div v-for="(item, index) in GuaShu.replace(/(.)(?=[^$])/g,'$1,').split(',')" :key="index">
            <yao :type="item"></yao>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Gua',
    components: {
        Yao: () => import('./Yao')
    },
    props: {
        GuaShu: {
            type: [String, Number],
            default: '101010'
        }
    }
};
</script>

<style lang="scss" scoped>
    .gua{
        width: 200px;
        overflow: hidden;
    }
</style>

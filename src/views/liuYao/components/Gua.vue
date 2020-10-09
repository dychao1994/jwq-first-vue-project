<template>
    <div class="gua">
        <!-- 本卦 -->
        <div class="ben-gua">
            <div class="gua-title">本卦</div>
            <div v-for="(item, index) in gua.benGua.replace(/(.)(?=[^$])/g,'$1,').split(',')" :key="index">
                <yao :type="item"></yao>
            </div>
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
    },
    data() {
        return {
            gua: {
                liuShen: [],
                benGua: '101010'
            }
        };
    }
};
</script>

<style lang="scss" scoped>
    .gua{
        display: flex;
        >div {
            width: 200px;
            margin-right: 20px;
        }
        .gua-title{
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            letter-spacing: 10px
        }
    }
</style>

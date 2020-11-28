<template>
    <div class="gua">
        <!-- 六神 -->
        <div class="liu-shen">
            <div class="gua-title">六神</div>
            <div v-for="(item, index) in gua.liuShen" :key="index" class="single-row">
                {{item}}
            </div>
        </div><!-- 本卦 -->
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
                liuShen: ['勾陈', '朱雀', '青龙', '玄武', '白虎', '螣蛇'],
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
            letter-spacing: 10px;
            margin-bottom: 4px;
        }
        .single-row{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 32px;
        }
        .liu-shen{
            width: 50px;
            .gua-title{
                text-align: center;
                font-weight: bold;
                font-size: 18px;
                letter-spacing: 0px
            }
        }
    }
</style>

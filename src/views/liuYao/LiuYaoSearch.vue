<template>
    <div class="liu-yao-search">
        <el-form ref="form" :model="searchForm" label-width="140px" :rules="rules" size="small">
            <el-form-item label="公历时间：" prop="date">
                <el-date-picker
                    v-model="searchForm.date"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="起卦方式：" prop="type" @change="handleChangeType">
                <el-radio-group
                    v-model="searchForm.type">
                    <el-radio v-for="(item, index) in typeArray" :key="index" :value="item" :label="item"></el-radio>
                </el-radio-group>
            </el-form-item>
            <template v-if="searchForm.type == '手工指定'">
                <el-form-item v-for="(item, index) in yaoSetting" :key="'yaoSetting_' + index" :label="item.label + '：'" :prop="item.field">
                    <div class="single-yao">
                        <el-select
                            v-model="searchForm[item.field]"
                            style="width: 220px"
                            :placeholder="'请选择' + item.label"
                        >
                            <el-option v-for="(inItem, inIndex) in item.optionArray" :key="'optionArray_' + inIndex" :value="inItem.value" :label="inItem.label">
                                <div class="liu-yao-option" style="display: flex; justify-content: space-between; align-items: center">
                                    <yao :type="inItem.value" mode="liuYao" height="24" :active="inItem.value > 1" style="width: calc(100% - 40px)"></yao>
                                    <div>{{inItem.label}}</div>
                                </div>
                            </el-option>
                        </el-select>
                        <yao v-if="searchForm[item.field] != ''" :type="searchForm[item.field]" mode="liuYao" :active="searchForm[item.field] > 1" style="width: 220px"></yao>
                    </div>
                </el-form-item>
            </template>
            <template v-else-if="searchForm.type == '时间起卦'">
                <el-form-item label="时间起卦方式：" prop="timeType" @change="handleChangeType">
                    <el-radio-group
                        v-model="searchForm.timeType">
                        <el-radio :label="0">按公历时间起卦</el-radio>
                        <el-radio :label="1">按甲子历时间起卦</el-radio>
                    </el-radio-group>
                </el-form-item>
            </template>
            <div class="button-panel">
                <el-button type="primary" size="small" @click="search">查询</el-button>
                <el-button size="small">重置</el-button>
            </div>
        </el-form>
        {{zhuGua}}
        <div>{{bianGua}}</div>
    </div>
</template>

<script>
import {getZhiNum} from '@/utils/ganZhiUtils.js';
import {Lunar, Solar} from 'lunar-javascript';
export default {
    name: 'LiuYaoSearch',
    components: {
        Yao: () => import('./components/Yao')
    },
    data() {
        const optionArray = [{
            label: '少阴',
            value: 0
        }, {
            label: '少阳',
            value: 1
        }, {
            label: '老阴',
            value: 2
        }, {
            label: '老阳',
            value: 3
        }];
        return {
            searchForm: {
                date: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
                type: '时间起卦',
                timeType: '',
                yao0: '',
                yao1: '',
                yao2: '',
                yao3: '',
                yao4: '',
                yao5: ''
            },
            typeArray: ['电脑自动', '手工指定', '时间起卦', '手动摇卦', '报数起卦'],
            yaoSetting: [{
                label: '第一爻',
                field: 'yao0',
                optionArray
            }, {
                label: '第二爻',
                field: 'yao1',
                optionArray
            }, {
                label: '第三爻',
                field: 'yao2',
                optionArray
            }, {
                label: '第四爻',
                field: 'yao3',
                optionArray
            }, {
                label: '第五爻',
                field: 'yao4',
                optionArray
            }, {
                label: '第六爻',
                field: 'yao5',
                optionArray
            }].reverse(),
            zhuGua: '',
            bianGua: '',
            rules: {
                date: [
                    {required: true, message: '请选择公历时间', trigger: 'blur'}
                ],
                type: [
                    {required: true, message: '请选择起卦方式', trigger: 'blur'}
                ],
                timeType: [
                    {required: true, message: '请选择时间起卦方式', trigger: 'blur'}
                ],
                yao0: [
                    {required: true, message: '请选择第一爻', trigger: 'blur'}
                ],
                yao1: [
                    {required: true, message: '请选择第二爻', trigger: 'blur'}
                ],
                yao2: [
                    {required: true, message: '请选择第三爻', trigger: 'blur'}
                ],
                yao3: [
                    {required: true, message: '请选择第四爻', trigger: 'blur'}
                ],
                yao4: [
                    {required: true, message: '请选择第五爻', trigger: 'blur'}
                ],
                yao5: [
                    {required: true, message: '请选择第六爻', trigger: 'blur'}
                ]
            }
        };
    },
    methods: {
        random() {
            let result = '';
            for (let i = 0; i < 6; i++) {
                result += Math.random().toFixed(0);
            }
            return result;
        },
        getGuaByTime() {
            const timeType = this.searchForm.timeType;
            let year = '';
            let month = '';
            let day = '';
            let hour = '';
            let minute = '';
            if (timeType == 0) {
                //  按公历时间起卦
                //  规则是：
                //      公历（年+月+日+时）除以８取余数做上卦，
                //      （年+月+日+时+分）除以８取余数做下卦，
                //      （年+月+日+时+分）除以６取余数做动爻）
                /*
                    卦		卦名		卦数		二进制数
                    000		坤		8		0
                    100		艮		7		4
                    010		坎		6		2
                    110		巽		5		6
                    001		震		4		1
                    101		离		3		5
                    011		兑		2		3
                    111		乾		1		7
                */
                const date = this.$dayjs(this.searchForm.date);
                year = date.year();
                month = date.month() + 1;
                day = date.date();
                hour = date.hour();
                minute = date.minute();
            } else {
                //  按农历时间起卦
                //  也即是传统的时间起卦方法
                //  农历（年支数+月+日）除以８取余数做上卦，
                //  （年支数+月+日+时支数）除以８取余数做下卦，
                //  （年支数+月+日+时支数）除以６取余数做动爻）
                // const solarLunar = Solar.fromDate(new Date(this.searchForm.date));
                const chinaLunar = Lunar.fromDate(new Date(this.searchForm.date));
                year = getZhiNum(chinaLunar.getYearZhiExact());
                month = getZhiNum(chinaLunar.getMonthZhiExact());
                day = getZhiNum(chinaLunar.getDayZhiExact());
                hour = getZhiNum(chinaLunar.getTimeZhi());
                minute = 0;
            }
            const guaUpNum2 = (year + month + day + (timeType == 0 ? hour : 0)) % 8; //  上卦数（2进制）
            const guaUpNum = 8 - guaUpNum2; //  上卦数
            const guaUp = this.addPreZero((guaUpNum).toString(2)).split('').reverse().join(''); //  上卦
            const guaDownNum2 = (year + month + day + hour + minute) % 8; //  下卦数（2进制）
            const guaDownNum = 8 - guaDownNum2; //  下卦数
            const guaDown = this.addPreZero((guaDownNum).toString(2)).split('').reverse().join(''); //  下卦
            const zhuGua = guaUp + guaDown;
            this.zhuGua = zhuGua;
            const dongYaoNum2 = 6 - (year + month + day + hour + minute) % 6; //  动爻（2进制）
            const bianGua = zhuGua.substr(0, dongYaoNum2) + (zhuGua.substr(dongYaoNum2, 1) == '0' ? '1' : '0') + zhuGua.substr(dongYaoNum2 + 1);
            this.bianGua = bianGua;
            console.log(year, month, day, hour, minute)
            console.log(guaUpNum2, guaDownNum2);
        },
        addPreZero(num, length) {
            //  自动补0
            return (`000${num}`).slice(-(length || 3));
        },
        search() {
            this.$refs.form.validate((validate) => {
                if (validate) {
                    switch (this.searchForm.type) {
                        case '电脑自动': {
                            this.zhuGua = this.random();
                            this.bianGua = this.random();
                            break;
                        }
                        case '时间起卦': {
                            this.getGuaByTime();
                            break;
                        }
                    }
                }
            });
        },
        handleChangeType(val) {
            this.zhuGua = '';
            this.bianGua = '';
        }
    }
};
</script>

<style lang="scss">
    .liu-yao-search{
        .button-panel{
            height: 40px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
        .single-yao{
            display: flex;
            align-items: center;
            >div{
                margin-right: 20px;
            }
            .liu-yao-option{
                display: flex;
                .yao{
                    width: calc(100% - 40px);
                }
            }

        }
    }
</style>

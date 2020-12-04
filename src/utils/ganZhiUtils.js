export function getZhiNum(diZhi) {
    //  获取地支数
    let diZhiNum = 0;
    switch (diZhi) {
        case '子': {
            diZhiNum = 1;
            break;
        }
        case '丑': {
            diZhiNum = 2;
            break;
        }
        case '寅': {
            diZhiNum = 3;
            break;
        }
        case '卯': {
            diZhiNum = 4;
            break;
        }
        case '辰': {
            diZhiNum = 5;
            break;
        }
        case '巳': {
            diZhiNum = 6;
            break;
        }
        case '午': {
            diZhiNum = 7;
            break;
        }
        case '未': {
            diZhiNum = 8;
            break;
        }
        case '申': {
            diZhiNum = 9;
            break;
        }
        case '酉': {
            diZhiNum = 10;
            break;
        }
        case '戌': {
            diZhiNum = 11;
            break;
        }
        case '亥': {
            diZhiNum = 12;
            break;
        }
    }
    return diZhiNum;
}

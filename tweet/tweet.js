import { createApp, reactive, onMounted, ref, computed } from "https://unpkg.com/vue@3.2.4/dist/vue.esm-browser.prod.js";
const app = createApp({
    setup() {
        const account = reactive({})
        const tweets = reactive([])
        const from = ref(0)
        const size = ref(20)
        const tab = ref(0)
        const onClickNext = () => {
            from.value += size.value
        }
        const onClickPrev = () => {
            from.value -= size.value
        }
        const changeTab = (num) => {
            tab.value = num
        }
        onMounted(async () => {
            const account_raw = await fetch("./manifest.json")
            const account_json = await account_raw.json()
            Object.assign(account, account_json)

            const tweets_raw = await fetch("./tweets.json")
            const tweets_json = (await tweets_raw.json()).map(tw=>{
                if (tw.full_text) {
                    tw.full_text = tw.full_text.replaceAll(/https:\/\/t\.co\/[0-9a-zA-Z]+/ig, "")
                }
                return tw
            })
            Object.assign(tweets, tweets_json)
        })
        const topMedia = computed(()=>{
            const NUM = 3
            const THRESH = 4
            let ret = []
            let buf = []
            let cnt = 0
            for (let tw of tweets) {
                if (tw.media) {
                    for (let m of tw.media) {
                        if(m.type!="photo") {break}
                        buf.push(m)
                        if (cnt%NUM==NUM-1) {
                            ret.push({
                                line: buf
                            })
                            buf = []
                        }
                        cnt += 1
                    }
                }
            }
            return ret.slice(0,THRESH)
        })
        return { account, tweets, from, size, onClickNext, onClickPrev, tab, changeTab, topMedia };
    },
});
app.mount("#tweet");
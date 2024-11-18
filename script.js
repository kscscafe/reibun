// 例文リストを初期化または取得
let examples = JSON.parse(localStorage.getItem("examples")) || [];
renderExamples();

// 例文を追加
function addExample() {
    const inputText = document.getElementById("inputText").value.trim();
    if (inputText) {
        const pinyinText = convertToPinyin(inputText); // 拼音変換
        if (Array.isArray(pinyinText) && pinyinText.length > 0) {
            examples.push({ text: inputText, pinyin: pinyinText, id: Date.now() });
            localStorage.setItem("examples", JSON.stringify(examples));
            renderExamples();
            document.getElementById("inputText").value = ""; // 入力欄をクリア
        } else {
            console.error("Failed to convert text to pinyin or pinyinText is empty.");
        }
    } else {
        console.warn("Input text is empty or only contains whitespace.");
    }
}

// 拼音変換
function convertToPinyin(text) {
    // pinyin-proライブラリのpinyinメソッドを使用して変換
    return window.pinyinPro.pinyin(text, { toneType: 'symbol', type: 'array' });
}

// 例文一覧を表示
function renderExamples() {
    const exampleList = document.getElementById("exampleList");
    exampleList.innerHTML = ""; // 既存のリストをクリア

    examples.forEach(example => {
        const exampleDiv = document.createElement("div");
        exampleDiv.className = "example-item";

        example.pinyin.forEach((pinyinWord, index) => {
            const ruby = document.createElement("ruby");

            ruby.className = getTone(pinyinWord); // 声調に基づいた背景色を設定
            ruby.textContent = example.text[index]; // 漢字を表示

            const rt = document.createElement("rt");
            rt.textContent = pinyinWord; // 拼音を表示
            ruby.appendChild(rt);

            exampleDiv.appendChild(ruby);
        });

        exampleList.appendChild(exampleDiv);
    });
}

// 声調番号を取得し、クラス名を返す
function getTone(pinyin) {
    if (!pinyin) return "tone-0";
    if (/[āēīōūǖ]/.test(pinyin)) return "tone-1";
    if (/[áéíóúǘ]/.test(pinyin)) return "tone-2";
    if (/[ǎěǐǒǔǚ]/.test(pinyin)) return "tone-3";
    if (/[àèìòùǜ]/.test(pinyin)) return "tone-4";
    return "tone-0"; // 軽声または1声
}

// 保存データを削除
function clearExamples() {
    localStorage.clear(); // localStorageをクリア
    examples = []; // メモリ上の例文リストもクリア
    renderExamples(); // 表示を更新
    console.log("All examples have been cleared from localStorage and memory."); // デバッグメッセージ
}
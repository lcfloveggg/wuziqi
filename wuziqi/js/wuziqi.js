/**
 * Created by Dell on 2017/10/27.
 */
{
    let start = document.querySelector("#start");
    let runstart = document.querySelector("#runstart");
    let container = document.querySelector(".container");
    let ai = document.querySelector("#ai");
    let moshi = document.querySelector("#yxms");
    let xuanze = document.querySelector("#moshi");
    let HY = document.querySelector("#huanying");
    let h2 = document.querySelector("h3");
    h2.onclick = function () {
      HY.style.display = "none";
      moshi.style.display = "block";
    };
    moshi.onclick = function () {
        moshi.style.display = "none";
        xuanze.style.display = "block";
        start.style.display = "block";
    };
    start.onclick = function () {
        container.classList.add("show");
        start.style.display = "none";
        xuanze.style.display = "none";
    };
    let isAI = false;
    ai.onfocus = function () {
        isAI = true;
    };
    let canvas = document.querySelector("canvas");
    let cobj = canvas.getContext("2d");
    let w = 40;
    let pos = {};
    let blank = {};


    function qipan() {
        cobj.clearRect(0, 0, 600, 600);
        cobj.beginPath();
        for (let i = 0; i < 15; i++) {
            cobj.moveTo(20, i * w + 20);
            cobj.lineTo(580, i * w + 20);
            cobj.moveTo(i * w + 20, 20);
            cobj.lineTo(i * w + 20, 580);
        }
        cobj.stroke();
        qidian(3, 3);
        qidian(7, 7);
        qidian(3, 11);
        qidian(11, 3);
        qidian(11, 11);
        function qidian(x, y) {
            cobj.save();
            cobj.translate(x * w + 20, y * w + 20);
            cobj.beginPath();
            cobj.arc(0, 0, 6, 0, Math.PI * 2);
            cobj.fill();
            cobj.restore();
            for (let i = 0; i < 15; i++) {
                for (let j = 0; j < 15; j++) {
                    blank [lj(i, j)] = true;
                }
            }
        }

        function luozi(x, y, color) {
            cobj.save();
            cobj.translate(x * w + 20, y * w + 20);
            cobj.fillStyle = color;
            cobj.beginPath();
            cobj.arc(0, 0, 20, 0, Math.PI * 2);
            cobj.fill();
            cobj.restore();
            pos[lj(x, y)] = color;
            delete blank[lj(x, y)];
        }

        let flag = true;
        canvas.onclick = function (e) {
            let x = Math.round((e.offsetX - 20) / w);
            let y = Math.round((e.offsetY - 20) / w);
            if (pos[lj(x, y)]) {
                return;
            }
            if (flag) {
                luozi(x, y, "white");
                if (panduan(x, y, "white") >= 5) {
                    return over("白棋");

                }
                if (isAI) {
                    let p = getPOS();   //{x:1,y:1}
                    luozi(p.x, p.y, "black");
                    if (panduan(p.x, p.y, "black") >= 5) {
                        return over("黑棋");
                    }
                    return;
                }
            }
            else {
                luozi(x, y, "black");
                if (panduan(x, y, "black") >= 5) {
                    return over("黑棋");
                }
            }
            flag = !flag;
        };
        function getPOS() {
            let max = 0;
            let pos = {};
            for (let i in blank) {
                let x = parseInt(i.split("_")[0]);
                let y = parseInt(i.split("_")[1]);
                let length = panduan(x, y, "black");
                if (length > max) {
                    max = length;
                    pos = {x, y};
                }
            }
            let max2 = 0;
            let pos2 = {};
            for (let i in blank) {
                let x = parseInt(i.split("_")[0]);
                let y = parseInt(i.split("_")[1]);
                let length = panduan(x, y, "white");
                if (length > max2) {
                    max2 = length;
                    pos2 = {x, y};
                }
            }
            if (max > max2) {
                return pos;
            }
            else {
                return pos2;
            }
        }

        function lj(x, y) {
            return x + "_" + y;
        }

        function panduan(x, y, color) {
            let heng = 1;
            let i = 1;
            while (pos[lj(x + i, y)] === color) {
                heng++;
                i++;
            }
            i = 1;
            while (pos[lj(x - i, y)] === color) {
                heng++;
                i++;
            }
            let shu = 1;
            i = 1;
            while (pos[lj(x, y + i)] === color) {
                shu++;
                i++;
            }
            i = 1;
            while (pos[lj(x, y - i)] === color) {
                shu++;
                i++;
            }
            let zx = 1;
            i = 1;
            while (pos[lj(x + i, y + i)] === color) {
                zx++;
                i++;
            }
            i = 1;
            while (pos[lj(x - i, y - i)] === color) {
                zx++;
                i++;
            }
            let yx = 1;
            i = 1;
            while (pos[lj(x + i, y - i)] === color) {
                yx++;
                i++;
            }
            i = 1;
            while (pos[lj(x - i, y + i)] === color) {
                yx++;
                i++;
            }
            return Math.max(heng, shu, zx, yx);
        }
    }

    qipan();
    let mask = document.querySelector(".mask");
    let h = document.querySelector("h1");

    function over(name) {
        mask.style.display = "block";
        runstart.style.display = "block";
        h.innerHTML = "恭喜" + name + "获胜";
    }

    let output = document.querySelector("#output");
    let imgbox = document.querySelector(".imgbox");
    let xiazai = document.querySelector("#xiazai");
    runstart.onclick = function () {
        mask.style.display = "none";
        container.classList.remove("show");
        moshi.style.display = "block";
        cobj.clearRect(0, 0, 600, 600);
        imgbox.style.display = "none";
        imgbox.innerHTML = "";
        isAI = false;
        pos = {};
        qipan();
    };
    output.onclick = function () {
        output.style.display = "none";
        xiazai.style.display = "block";
        imgbox.style.display = "block";
        num();
        let url = canvas.toDataURL();
        let newimg = new Image();
        newimg.src = url;
        imgbox.appendChild(newimg);
        xiazai.href = url;
        xiazai.setAttribute("download", "棋谱.png");
    };
    function num() {
        let n = 1;
        for (let i in pos) {
            let x = parseInt(i.split("_")[0]);
            let y = parseInt(i.split("_")[1]);
            cobj.save();
            cobj.font = "14px 微软雅黑";
            cobj.textAlign = "center";
            cobj.textBaseline = "middle";
            if (pos[i] === "black") {
                cobj.fillStyle = "white";
            }
            else {
                cobj.fillStyle = "black";
            }
            cobj.translate(x * w + 20, y * w + 20);
            cobj.fillText(n++, 0, 0);
            cobj.restore();
        }
    }
    let music = document.querySelector(".yinyue");
    let audio = document.querySelector("audio");
    let flag2 = true;
    music.onclick = function () {
        if (flag2) {
            music.style.animationPlayState = "paused";
            audio.pause();
        } else {
            music.style.animationPlayState = "running";
            audio.play();
        }
        flag2 = !flag2;
    };
}
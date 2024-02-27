const puppeteer = require("puppeteer");
const path = require("path");

path.join(__dirname, "node_modules/vm2/lib/setup-sandbox.js");


const user = process.argv[2];
// 登录密码
const pwd = process.argv[3];

if (!user || !pwd) {
  console.log("请输入账号或密码.")
  process.exit(1)
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // 显示浏览器页面
    ignoreHTTPSErrors: true, // 忽略https证书
    args: ["--window-size=1400,1080"],
  });
  const page = await browser.newPage();
  page.setViewport({
    width: 1400,
    height: 1080,
  });

  /**
   * 监听操作log
   */
  page.on("console", (msg) => {
    console.log("PAGE LOG:", msg.text());
    if (msg.text().includes("nsfplauncher")) {
      console.log("打开成功");
      setTimeout(() => {
        browser.close();
      }, 1500);
    }
  });
  await page.goto("https://123.125.232.132:10120/user/login");
  await page.focus("#username");
  await page.keyboard.sendCharacter(user);

  // 定位焦点
  await page.focus("#password");
  // 给input发送字符串
  await page.keyboard.sendCharacter(pwd);

  // 点击登录按钮
  await page.click("#login");
})();

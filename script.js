// const firstTime = {
//   setup: true,
//   selectTasks: true,
//   getBookworkCodes: true,
// }
setInterval(() => {
  if (document.querySelector(".answer") != null) getBookworkCode()
  // const view = document.querySelector(".view")
  // switch (view.classList[1]) {
  //   case "package-list-view":
  //     setup()
  //     break
  //   case "task-view":
  //     selectTasks()
  //     break
  //   default:
  //     getBookworkCode()
  // }
}, 50)

// async function setup() {
//   if (firstTime.setup) {
//     await pause(1500)
//     firstTime.setup = false
//   }
//   const taskOpenTab = document.querySelector(".package > .package-heading")
//   taskOpenTab.addEventListener("click", async () => {
//     await pause(250)
//     const allTasks = document.querySelectorAll(
//       ".package > span > .task-list > .task-list-item"
//     )
//     const tasks = [...allTasks].filter((t) => !t.classList.contains("complete"))
//     tasks.forEach((task) => {
//       task.addEventListener("click", async () => {
//         await pause(50)
//         selectTasks()
//       })
//     })
//   })
// }

// async function selectTasks() {
//   if (firstTime.selectTasks) {
//     await pause(1500)
//     firstTime.selectTasks = false
//   }
//   const tasks = document.querySelectorAll(".taskitem")
//   console.log(tasks)
//   tasks.forEach((task) => {
//     task.addEventListener("click", getBookworkCode)
//   })
// }

async function getBookworkCode() {
  let question = false
  // if (firstTime.getBookworkCodes) {
  //   await pause(1000)
  //   firstTime.getBookworkCodes = false
  // }
  if (document.querySelector("#answer-wac-box") != null) {
    const codeContainer = document.querySelector(".bookwork-code")
    const code = codeContainer.textContent.split(": ")[1]
    document.querySelector(
      ".wac-text"
    ).innerHTML = `What is the correct answer for this bookwork code?\n Your answer was: ${
      JSON.parse(localStorage.getItem("bookwork-codes-list"))[code]
    }`
    return
  }
  if (document.querySelector(".question-only") != null) {
    question = true
  }

  const container = document.querySelector(".bookwork-code span")
  const bookworkCode = container.textContent.split(": ")[1]
  // console.log(bookworkCode)
  if (question) return
  const submitBtn = document.querySelector("#skill-delivery-submit-button")
  // console.log({ submitBtn })
  if (!submitBtn.classList.contains("btn-disabled")) {
    getAnswer(bookworkCode)
  }
  submitBtn.addEventListener("click", () => getAnswer(bookworkCode))
}

// async function pause(time) {
//   await new Promise((resolve) => {
//     setTimeout(resolve, time)
//   })
// }

function getAnswer(bookworkCode) {
  let answer = null
  if (document.querySelector(".answer > .choices") != null) {
    answer = document.querySelector(
      ".answer > .choices > .selected > div > .text > .katex > .katex-mathml > math"
    ).outerHTML
  }

  if (
    document.querySelector(
      ".answer > .answer-part-outer > .answer-part > .gap-container > .keypad-number-input > .number-input"
    ) != null
  ) {
    answer = [...document.querySelectorAll("input.number-input")]
      .reduce((a, i) => `${a}, ${i.value}`, "")
      .replace(", ", "")
  }
  if (
    document.querySelector(
      ".answer > .answer-part-outer > .answer-part > .gap-container > .gap-slot"
    ) != null &&
    document.querySelector(
      ".answer > .answer-part-outer > .answer-part > .gap-container > .gap-slot > div > div > div > div > .text > .katex > .katex-mathml"
    ) == null
  ) {
    answer = [...document.querySelectorAll(".text-container span.text")]
      .reduce((a, i) => {
        return `${a}, ${i.textContent}`
      }, "")
      .replace(", ", "")
  }

  if (document.querySelector(".answer > .cards") != null) {
    let vinc = null
    if (document.querySelectorAll(".vinculum") != null) vinc = true
    answer = [
      ...document.querySelectorAll(
        ".answer > .slots > .slot > .card > div > .text > .katex > .katex-html > .base > span.mord"
      ),
    ]
      .reduce((a, i) => `${a}, ${i.textContent}`, "")
      .replace(", ", "")
      .replace(", ", vinc ? "/" : ", ")
  }

  if (
    document.querySelector(
      ".answer > .answer-part-outer > .answer-part > .gap-container > .gap-slot > div > div > div > div > .text > .katex > .katex-mathml"
    ) != null
  ) {
    const vars = [...document.querySelectorAll("span.mord.mathdefault")]
    vars.shift()
    const signs = [...document.querySelectorAll("span.mrel")]
    signs.shift()
    const values = [
      ...document.querySelectorAll(
        ".answer > .answer-part-outer > .answer-part > .gap-container > .gap-slot > div > div > div > div > .text > .katex > .katex-html .base"
      ),
    ]
    answer = vars
      .reduce((a, l, i) => {
        return `${a}, ${l.textContent} ${signs[i].textContent} ${values[i].outerHTML}`
      }, "")
      .replace(", ", "")
  }
  answer ??= document.querySelector(".answer input").value
  // console.log({ answer })
  const prevAnswers =
    JSON.parse(localStorage.getItem("bookwork-codes-list")) ?? {}
  prevAnswers[bookworkCode] = answer
  localStorage.setItem("bookwork-codes-list", JSON.stringify(prevAnswers))
}

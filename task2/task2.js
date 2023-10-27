const readline = require("readline");
// const eventEmitter = require("node:events");
const fs = require("fs").promises;

const rl = readline.createInterface({
  input: process.stdin, // input from standard stream
  output: process.stdout, // output to standard stream
});

const questionsList = [
  "Enter the user's name. To cancel press ENTER:",
  "Choose your gender:",
  "Enter your age:",
];

class MyQuestionary {
  constructor(questionsList) {
    this.questionsList = questionsList;
    this.counter = 0;
    this.data = {
      name: "",
      gender: "",
      age: "",
    };
  }

  // set resetCounter(num) {
  //   this.counter = num;
  // }

  close() {
    rl.setPrompt("Good bye!");
    rl.prompt();
    rl.close();
  }

  async getFileData(fileName) {
    const res = (await fs.readFile(fileName)).toString();
    return res;
  }

  createUser(fileName) {
    return fs.appendFile(
      fileName,
      this.getFileData(fileName)
        ? ", " + JSON.stringify(this.data)
        : JSON.stringify(this.data)
    );
  }

  createQuestion() {
    const dataKeys = Object.keys(this.data);

    if (this.counter < this.questionsList.length - 1) {
      rl.question(this.questionsList[this.counter], (answer) => {
        if (answer === "") {
          this.databaseSearch();
        } else if (answer === "exit") {
          return this.close();
        }
        this.data[dataKeys[this.counter]] = answer;
        this.counter += 1;
        return this.createQuestion();
      });
      return;
    }

    rl.question(this.questionsList[this.counter], async (answer) => {
      this.data[dataKeys[this.counter]] = answer;
      this.createUser("data.txt");
      this.counter = 0;
      this.createQuestion();
    });
  }

  databaseSearch() {
    rl.question("Would you to search in DB?", async (answer) => {
      // completer(answer);
      switch (answer.toLowerCase()) {
        case "y":
          const result = (await this.getFileData("data.txt")).toString();
          result.split(", ").map((el) => console.log(JSON.parse(el)));
          rl.question(
            "Enter user's name you wanna find in DB: ",
            async (req) => {
              const result = (await this.getFileData("data.txt")).toString();
              const findedUser = result.split(", ").reduce((acc, el) => {
                const parsed = JSON.parse(el);
                if (parsed?.name?.toLowerCase() === req.trim().toLowerCase()) {
                  acc.push(parsed);
                  return acc;
                }
                return acc;
              }, []);

              const [user] = findedUser;
              console.log(user);
              this.createQuestion();
            }
          );
          break;
        case "n":
          this.counter = 0;
          this.createQuestion();
          break;
        default:
          console.log("Only Y(yes) or N(no) is permitted");
          this.databaseSearch();
      }
    });
  }
}

function completer(line) {
  const completions = "male female".split(" ");
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : completions, line];
}

const questionary = new MyQuestionary(questionsList);
questionary.createQuestion();

// fs.writeFile("data.txt");

// async function createUser() {
//   const data = {};

//   rl.question("Enter the user's name. To cancel press ENTER:", async (name) => {
//     if (name === "") {
//       await rl.question("Would you to search in DB?", async (answer) => {
//         switch (answer.toLowerCase()) {
//           case "y":
//             const result = await getFileData();
//             console.log(result.map((el) => JSON.parse(el)));

//             rl.question(
//               "Enter user's name you wanna find in DB",
// async (user) => {
//   const result = await getFileData();
//   const findedUser = result.reduce((acc, el) => {
//     const parsed = JSON.parse(el);
//     if (parsed.name.toLowerCase() === user.trim().toLowerCase()) {
//       acc.push(parsed);
//       return acc;
//     }
//     return acc;
//   }, []);
//   console.log(findedUser);
//                 createUser();
//               }
//             );
//             break;

//           case "n":
//             rl.close();
//             break;

//           default:
//             console.log("Only Y(yes) or N(no) permitted");
//         }
//       });
//     }
//     // readline.emitKeypressEvents(rl);
//     data.name = name;

//     rl.question("Choose your gender:", (gender) => {
//       completer(gender);
//       data.gender = gender;
//       rl.question("Enter your age:", async (age) => {
//         data.age = age;
//         const file = await fs.readFile("data.txt");
//         // if (!file.toString()) {
//         fs.appendFile(
//           "data.txt",
//           file.toString() ? ", " + JSON.stringify(data) : JSON.stringify(data)
//         );
//         createUser();
//       });
//     });
//   });
// }

// async function getFileData() {
//   const res = await fs.readFile("data.txt");
//   return res.toString().split(", ");
// }

// async function getDBData() {
//   rl.question("Would you to search in DB?", (answer) => {
//     switch (answer) {
//     }
//   });
// }

// function completer(line) {
//   const completions = ".male .female".split(" ");
//   const hits = completions.filter((c) => c.startsWith(line));
//   return [hits.length ? hits : completions, line];
// }

// createUser();

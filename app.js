const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("close", function () {
  console.log("Good bye!");
  process.exit(0);
});

const asker = () => {
  rl.question("Input your words separated by comma?", (answer) => {
    if (answer === "exit") {
      rl.close();
    }
    const array = answer.split(",");
    rl.question(
      `How would you like to sort words? \n
    1. Words by name(from A to Z). \n
    2. Show digits from the smallest. \n
    3. Show digits from the biggest. \n
    4. Words by quantity of letters.\n
    5. Only unique words. \n
    6. Display only unique values from the set of words and numbers. \n`,
      (method) => {
        switch (method) {
          case "1":
            console.log(
              array.sort((a, b) => {
                if (a.toLowerCase < b.toLowerCase) return b.localeCompare(a);
                return a.localeCompare(b);
              })
            );
            asker();
            return;
          case "2":
            console.log(array.sort((a, b) => b - a));
            asker();
            return;
          case "3":
            console.log(array.sort((a, b) => a - b));
            asker();
            return;
          case "4":
            console.log(array.sort((a, b) => a.length - b.length));
            asker();
            return;
          case "5":
            console.log([...new Set(array.map((el) => el.toLowerCase()))]);
            asker();
            return;
          case "6":
            console.log(
              array.reduce((acc, el, idx) => {
                if (array.indexOf(el.toLowerCase()) === idx) {
                  acc.push(el);
                  return acc;
                }
                return acc;
              }, [])
            );
            asker();
            return;
          default:
            asker();
        }
      }
    );
  });
};

asker();

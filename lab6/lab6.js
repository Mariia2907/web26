//завдання 1
let a = 7;
let b = 5;
console.log("сума:", a+b);
console.log("різниця:" , a-b);
console.log("множення:" , a*b);
console.log("ділення:" , a/b);

//завдання 2
let firstName = "Марія";
let lastName = "Гонта";
let fullName = firstName + " " + lastName;
console.log("Привіт, " + fullName + "!");

//завдання 3
let age=20;
if (age >= 18) {
    console.log("доступ дозволено");
} else {
    console.log("доступ заборонено");
}

//завдання 4
for (let i = 1; i <= 10; i++) {
    console.log("число від 1 до 10: " +i);
}

//завдання 5
function square(number) {
    return number*number;
}
const result = square(5);
console.log("квадрат числа 5: "+result);

//завдання 6
let fruits = ["apple","orange","banana"];
fruits.push("chery");
console.log("масив: " + fruits);
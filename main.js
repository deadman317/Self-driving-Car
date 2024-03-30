const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 800;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 1000;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < N; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.2);
    }
  }
}
function generateCars(N) {
  const cars = [];
  for (let i = 0; i < N; i++) {
    cars.push(
      new Car(
        road.getLaneCenter(Math.floor(Math.random() * 3)),
        0,
        28,
        50,
        "AI",
        12
      )
    );
  }
  return cars;
}

function save() {
  console.log("saved");
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  console.log("discarded");
  localStorage.removeItem("bestBrain");
}

const traffic = [
  new Car(road.getLaneCenter(0), -500, 30, 50, "AUTO", 1),
  new Car(road.getLaneCenter(1), -300, 30, 50, "AUTO", 1),
  new Car(road.getLaneCenter(2), -400, 30, 50, "AUTO", 1.5),
];

// generate a random car with random speeds
function generateRandomCars(mainCarY) {
  const randomSpeed = Math.random() * 1 + 1;
  const randomLane = Math.floor(Math.random() * 3);
  return new Car(
    road.getLaneCenter(randomLane),
    mainCarY - 800,
    30,
    50,
    "AUTO",
    randomSpeed
  );
}

let i = 0;
animate();
function animate(time) {
  if (i++ % 20 == 0) {
    traffic.push(generateRandomCars(bestCar.y));
  }
  for (let car of traffic) {
    car.update([], []);
  }

  for (let car of cars) {
    if (car.y - bestCar.y < 100) {
      car.update(road.borders, traffic);
    }
  }

  bestCar = cars.find(
    (c) =>
      c.y + c.keypresscount ==
      Math.min(...cars.map((c) => c.y + c.keypresscount))
  );

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.8);

  road.draw(carCtx);
  for (let car of traffic) {
    car.draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 0.2;
  for (let car of cars) {
    if (car.y - bestCar.y < 100) {
      car.draw(carCtx, "green");
    }
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "green", true);
  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  if (traffic[0].y > bestCar.y + 500) {
    traffic.shift();
  }
  requestAnimationFrame(animate);
}

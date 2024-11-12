interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
}

let toDo = document.querySelector(".form") as HTMLFormElement;
let input = document.querySelector(".input") as HTMLInputElement;
let list = document.querySelector(".list") as HTMLUListElement;

let allToDo = document.querySelector(".allToDo .count") as HTMLSpanElement;
let completed = document.querySelector(".completed .count") as HTMLSpanElement;
let unCompleted = document.querySelector(
  ".unCompleted .count"
) as HTMLSpanElement;
let allToDoWrap = document.querySelector(".allToDo") as HTMLElement;
let completedWrap = document.querySelector(".completed") as HTMLElement;
let unCompletedWrap = document.querySelector(".unCompleted") as HTMLElement;

let todos: Todo[] = JSON.parse(localStorage.getItem("todos") || "[]");

toDo.addEventListener("submit", (e: Event) => {
  e.preventDefault();

  let notification = document.querySelector(".notification") as HTMLElement;

  if (input.value.trim() === "") {
    let notificationText = notification.querySelector(
      "span"
    ) as HTMLSpanElement;
    notificationText.textContent = "Please enter a task";
    notificationText.classList.add("text-red-700");
    notification.classList.add("right-4");
    notification.classList.remove("right-[-100%]");

    setTimeout(() => {
      notification.classList.remove("right-4");
      notification.classList.add("right-[-100%]");
    }, 1000);
    return;
  }

  const data: Todo = {
    id: todos.length + 1,
    title: input.value,
    isCompleted: false,
  };

  todos.unshift(data);
  input.value = "";
  (e.target as HTMLFormElement).reset();
  renderToDo(todos);
  updatePieChart();
  localStorage.setItem("todos", JSON.stringify(todos));
});

function renderToDo(arr: Todo[]): void {
  list.innerHTML = "";
  list.classList.add("p-3");

  if (arr.length === 0) {
    list.innerHTML = `<li class="text-center text-lg">No todo.</li>`;
  } else {
    const mappedtodos = arr
      .map((item, index) => {
        return `
            <li class="todo-item-wrapper w-full flex items-center justify-between backdrop-blur-[2px] p-2 rounded-lg ${
              item.isCompleted ? "opacity-70" : ""
            }"  data-id="${item.id}">
                <div class="todo-item flex items-center justify-between w-full gap-2">
                    <div class="todo-info flex items-center sm:w-[48%] w-full">
                        <div data-id="${
                          item.id
                        }" class="complete-wrapper w-[20px] h-[19px] border-2 border-green-800 rounded-full flex items-center justify-center cursor-pointer">
                            <div class="complete w-[100%] h-[100%] ${
                              item.isCompleted
                                ? "bg-green-800 border-2 border-white"
                                : ""
                            } rounded-full"></div>
                        </div>
                        <div class="flex items-center gap-2 ml-2">
                            <span>${index + 1}. </span>
                            <p class="font-bold ${
                              item.isCompleted ? "line-through" : ""
                            } sm:w-[100%] ww-full break-words">${item.title}</p>
                        </div>
                    </div>
                    <div class="flex justify-end gap-3 todo-buttons sm:w-[48%] w-full">
                        <button data-id="${
                          item.id
                        }" class="delete text-center w-[100px] bg-red border  rounded-lg p-2 hover:bg-white hover:text-red-800 duration-200">Delete</button>
                        <button data-id="${
                          item.id
                        }" class="update text-center w-[100px] bg-red border  rounded-lg p-2 hover:bg-white hover:text-blue-800 duration-200">Update</button>
                    </div>
                </div>
            </li>
            `;
      })
      .join("");

    list.innerHTML = mappedtodos;
  }

  allToDo.textContent = todos.length.toString();
  unCompleted.textContent = todos
    .filter((item: Todo) => !item.isCompleted)
    .length.toString();
  completed.textContent = todos
    .filter((item: Todo) => item.isCompleted)
    .length.toString();
}
renderToDo(todos);

// Chart
function updatePieChart() {
  const completedCount = todos.filter((todo: Todo) => todo.isCompleted).length;
  const totalCount = todos.length;

  const completedPercentage =
    totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
  const uncompletedPercentage = 100 - completedPercentage;

  const completedDashArray = `${completedPercentage} ${
    100 - completedPercentage
  }`;
  const uncompletedDashArray = `${uncompletedPercentage} ${
    100 - uncompletedPercentage
  }`;

  const completedSlice = document.querySelector(
    ".slice-completed"
  ) as SVGCircleElement;
  const uncompletedSlice = document.querySelector(
    ".slice-uncompleted"
  ) as SVGCircleElement;

  if (completedSlice) {
    completedSlice.style.strokeDasharray = completedDashArray;
  }

  if (uncompletedSlice) {
    uncompletedSlice.style.strokeDasharray = uncompletedDashArray;
  }

  const percentageDisplay = document.querySelector(
    ".percentage-display"
  ) as HTMLDivElement;

  if (percentageDisplay) {
    percentageDisplay.textContent =
      totalCount === 0
        ? "0.00% Completed"
        : `${completedPercentage.toFixed(2)}% Completed`;
  }
}

updatePieChart();

list.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains("delete")) {
    const id = target.dataset.id as string;

    const deleteModal = document.querySelector(
      ".delete-outer"
    ) as HTMLDivElement;
    const confirmDeleteButton = deleteModal.querySelector(
      ".confirm-delete"
    ) as HTMLButtonElement;
    const cancelDeleteButton = deleteModal.querySelector(
      ".cancel-delete"
    ) as HTMLButtonElement;
    const closeDeleteButton = deleteModal.querySelector(
      ".close-deelete"
    ) as HTMLButtonElement;
    const notification = document.querySelector(".notification") as HTMLElement;
    const notificationText = notification.querySelector(
      "span"
    ) as HTMLSpanElement;

    deleteModal.classList.remove("scale-0");
    deleteModal.classList.add("duration-300");

    deleteModal.onclick = (e) => {
      if ((e.target as HTMLDivElement).classList.contains("delete-outer")) {
        deleteModal.classList.add("scale-0");
      }
    };

    confirmDeleteButton.onclick = () => {
      todos = todos.filter((todo) => todo.id !== parseInt(id));
      renderToDo(todos);
      updatePieChart();
      localStorage.setItem("todos", JSON.stringify(todos));

      notificationText.textContent = "To-Do has been deleted!";
      notificationText.classList.add("text-red-700");
      notification.classList.add("right-4");
      notification.classList.remove("right-[-100%]");

      setTimeout(() => {
        notification.classList.remove("right-4");
        notification.classList.add("right-[-100%]");
      }, 1000);

      deleteModal.classList.add("scale-0");
    };

    cancelDeleteButton.onclick = () => {
      deleteModal.classList.add("scale-0");
    };

    closeDeleteButton.onclick = () => {
      deleteModal.classList.add("scale-0");
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        deleteModal.classList.add("scale-0");
      }
    });
  }

  if (target.classList.contains("complete")) {
    const id = (target.closest(".complete-wrapper") as HTMLElement).dataset
      .id as string;
    const item = todos.find((item) => item.id === parseInt(id))!;
    item.isCompleted = !item.isCompleted;
    renderToDo(todos);
    updatePieChart();
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  if (target.classList.contains("update")) {
    const id = target.dataset.id as string;
    const item = todos.find((item) => item.id === parseInt(id))!;

    let modalUpdate = document.querySelector(".update-outer") as HTMLElement;
    modalUpdate.classList.remove("scale-0");
    modalUpdate.classList.add("duration-300");
    modalUpdate.onclick = (e) => {
      if ((e.target as HTMLDivElement).classList.contains("update-outer")) {
        modalUpdate.classList.add("scale-0");
      }
    };
    let updateInput = document.querySelector(
      ".update-input"
    ) as HTMLInputElement;
    updateInput.value = item.title;

    let updateButton = document.querySelector(".update-button") as HTMLElement;
    let notification = document.querySelector(".notification") as HTMLElement;
    updateButton.onclick = () => {
      let notificationText = notification.querySelector(
        "span"
      ) as HTMLSpanElement;

      if (item.title === updateInput.value) {
        notificationText.textContent = "Nothing changed";
        notificationText.classList.remove("text-green-700");
        notificationText.classList.add("text-blue-700");
      } else {
        item.title = updateInput.value;
        item.isCompleted = false;
        renderToDo(todos);
        modalUpdate.classList.add("scale-0");

        notificationText.textContent = "To Do is updated";
        notificationText.classList.remove("text-blue-700");
        notificationText.classList.add("text-green-700");
      }

      notification.classList.add("right-4");
      notification.classList.remove("right-[-100%]");

      setTimeout(() => {
        notification.classList.remove("right-4");
        notification.classList.add("right-[-100%]");
      }, 1000);
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        modalUpdate.classList.add("scale-0");
      }
    });

    let closeModalBtn = document.querySelector(".close-modal") as HTMLElement;
    closeModalBtn.onclick = () => {
      modalUpdate.classList.add("scale-0");
    };
  }
});

function throwItem(item: HTMLElement): void {
  item.classList.add("throw");
}

allToDoWrap.addEventListener("click", () => {
  renderToDo(todos);
});

completedWrap.addEventListener("click", () => {
  const completedToDos = todos.filter((item) => item.isCompleted === true);
  renderToDo(completedToDos);
});

unCompletedWrap.addEventListener("click", () => {
  const unCompletedToDos = todos.filter((item) => item.isCompleted === false);
  renderToDo(unCompletedToDos);
});

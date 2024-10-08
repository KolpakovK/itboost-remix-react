export var ua = {
    login:{
        greating:"Увійдіть до кабінету щоб розпочати роботу",
        headline:[
            "Навчальна платформа","ITBoost",
        ],
        legal:[
            "Користуючись цим сервісом ви погоджуєтесь на","політику використання кукі файлів."
        ],
        toast: "Привіт,"
    },
    loginForm:{
        error:"Помилка!",
        success:"Успіх!",
        username:"Ім'я користувача",
        password:"Пароль",
        forgotPassword:[
            "Забули пароль? Зав'яжіться з менеджером для його відновлення. "
        ],
        submit:"Увійти"
    },
    dashboard:{
        pageName:"Привіт, ",
        pageSubtitle:"Головна",
        tableHint:["Сьогодні"],
        
        teacher:{
            tableCol:["Предмет","Група","Дата","Час","Дія"],
            cards:[
                "Домашні завдання"
            ],
            cardsBtn:["Перейти до робот",],
            scheduleLabel:"Графік занять на наступні 2 тижні",
            alert:{
                title:"У вас в графіку нема занять!",
                description:"Якщо ви впевнені, що у вас є назначені заняття - зверніться до адміністрації."
            }
        },
        student:{
            tableCol:["Предмет","Викладач","Дата","Час","Дія"],
            cards:[
                "Оцінки", "Домашні завдання", "Уроків на місяць", "Відвідування"
            ],
            cardsBtn:["Переглянути активність","Перейти до робот","Переглянути календар","Переглянути активність"],
            scheduleLabel:"Графік занять на наступні 2 тижні",
            alert:{
                title:"У вас в графіку нема занять!",
                description:"Якщо ви впевнені, що у вас є назначені заняття - зверніться до адміністрації."
            }
        }
    },
    today:{
        toastError:"Помилка!",
        toastSuccess:"Готово!",
        pageSubtitle:"Оберіть заняття для початку",
        pageName:"Заняття на сьогодні",
        alert:{
            title:"У вас в графіку нема занять!",
            description:"Якщо ви впевнені, що у вас є назначені заняття - зверніться до адміністрації."
        },
        schedule:{
            theme:"Тема урока",
            saveBtn:"Зберегти"
        },
        uploadHW:{
            trigger:"Домашня робота",
            title:"Завантажити роботу",
            description:"Введіть тему, додайте опис та завантажте файл на перевірку.",
            fields:{
                theme:"Тема",
                description:"Опис",
                dueDate:"Виповнити до",
                file:"Файл",
                fileHint:"Файл не повинен бути більше ніж 5 мегабайт",
                submit:"Завантажити"
            }
        }
    },
    calendar:{
        pageName:"Календар занять"
    },
    homeworkPage:{
        toastError:"Помилка",
        toastSuccess:"Готово!",
        pageName:"Домашні роботи",
        tabs:[
            "До виконання","Всі"
        ],
        student:{
            alert:{
                title:"Нема завдань на виконання!",
                description:"Вау! В це важко повірити, але у вас нема завдань на перевірку. Так тримати!"
            },
            filters:{
                course:"Курс:"
            },
            table:[
                "#","Урок","Завдання","Викладач","Дата створення ДЗ","Оцінка"
            ],
            card:{
                teacher:"Викладач:",
                dueDate:"Виконати до:",
                hwBtn:"Завдання"
            },
            tableRow:{
                hwBtn:"Завдання",
                notMarked:"Ще не перевірено",
                toDo:"Потрібно винокати"
            }
        },
        teacher:{
            alert:{
                title:"Нема завдань на виконання!",
                description:"Вау! В це важко повірити, але у вас нема завдань на перевірку. Так тримати!"
            },
            filters:{
                group:"Група:",
                course:"Курс:"
            },
            table:[
                "#",
                "Студент",
                "Дата завантаження",
                "Примітка",
                "Завдання",
                "Робота",
                "Оцінка",
            ],
            card:{
                course:"Предмет:",
                lesson:"Тема:",
                due:"Виконати до:",
                uploaded:"Завантажено:",
                task:"Завдання:",
                hwBtn:"Завдання",
                workBtn:"Робота",
                missingFile:"Файл не завантажен"
            },
            tableRow:{
                inTime:"Вчасно",
                late:"Запізно",
                notMarked:"Не перевірено"
            }
        }
    },
    allStudents:{
        pageSubtitle:"Тут ви знайдете інформацію по студентам",
        pageName:"Всі студенти",
        filter:"Группа:",
        card:{
            age:"Вік:",
            phoneNumber:"Номер телефона:",
            mail:"Пошта:",
        }
    },
    materials:{
        pageSubtitle:"Тут ви знайдете всі актуальні матеріали",
        pageName:"Матеріали для занять",
        filter:"Матеріал:",
        downloadBtn:"Завантажити"
    },
    settings:{
        toast:{
            title:"Збережено!",
            description:"Bla-bla"
        },
        pageSubtitle:"Налаштування",
        pageName:"Привіт,",
        fields:{
            name:"Ім'я",
            role:"Роль",
            age:"Вік",
            photo:"Фото",
            phoneNumber:"Номер телефону",
            mail:"Пошта",
            bio:"БІО",
            submit:"Зберегти"
        }
    },
    activity:{
        pageSubtitle:"Тут ви знайдете інформацію про активність",
        pageName:"Активність",
        filter:"Курс:",
        alert:{
            title:"Нема завдань на виконання!",
            description:"Вау! В це важко повірити, але у вас нема завдань на перевірку. Так тримати!"
        },
        card:{
            name:"Назва:",
            date:"Дата:",
            markHW:"Оцінка за домашню роботу:",
            mark:"Оцінка на заняті:",
            presentLabel:"Відвідування:",
            late:"Запізнення",
            present:"Присутність",
            notPresent:"Відсутність"
        }
    }
}
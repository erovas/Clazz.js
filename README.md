# Clazz.js
Small library to create classes without using class syntax.

## Example

``` html
<script src="Clazz.js"></script>
<script>
    
    let Person = Clazz({
        
        Constructor: function(first, last, age, gender, interests) {
            this.name = {
                first: first,
                last: last
            };
            this.age = age;
            this.gender = gender;
            this.interests = interests;
        },

        greeting: function() {
            console.log("Hi! I'm " + this.name.first);
        },

        farewell: function() {
            console.log(this.name.first + " has left the building. Bye for now!");
        },

        get Age(){
            return this.age
        },

        set Age(value){
            this.age = value
        },

        Static: {
            Hi: function(){
                console.log("Hello from out");
            }
        }
    });

    Person.Hi();
    // Hello from out

    let han = new Person('Han', 'Solo', 25, 'male', ['Smuggling']);
    han.greeting();
    // Hi! I'm Han

    let leia = new Person('Leia', 'Organa', 19, 'female' ['Government']);
    leia.Age = 20;
    leia.farewell();
    // Leia has left the building. Bye for now


    //-----------------------------------------------------------------------
    //Inheritance
    //-----------------------------------------------------------------------

    let Teacher = Clazz({

        Extends: Person,

        Constructor: function(first, last, age, gender, interests, subject, grade) {
            this.Super(first, last, age, gender, interests);

            // subject and grade are specific to Teacher
            this.subject = subject;
            this.grade = grade;
        },

        Static: {
            HiFive: function(){
                console.log("Hi Five!");
            }
        }
    });

    Teacher.Hi();
    // Hello from out

    Teacher.HiFive();
    // Hi Five!

    let snape = new Teacher('Severus', 'Snape', 58, 'male', ['Potions'], 'Dark arts', 5);
    snape.greeting(); 
    // Hi! I'm Severus.

    snape.farewell(); 
    // Severus has left the building. Bye for now.
    snape.Age = 60
    console.log(snape.age); // 60
    console.log(snape.subject); // Dark arts
  
</script>
```
# lp_solve_online_dev

You can try out the web app deployed on Heroku here:
- [https://lpsolveweb.herokuapp.com/](https://lpsolveweb.herokuapp.com/)

This project aims to build an accessible, online linear programming optimization interface.
The web app works with a complementary backend server that processes algebraic optimization models and finds the optimal solution, if possible. The Github repository for the server can be found in [this GitHub repository](https://github.com/ayang4114/lp_solve_server_dev/tree/master).

## Syntax and Semantics

The syntax is largely based on that used in lpsolve library and IDE, and it additionally implements 'for' and 'summation' statements to make linear modeling more succint.

### Objective Statement
- Declare whether the objective is **max** or **min**. Alternatively, the terms **maximize** and **minimize** can be used respectively.
- Include a colon (**:**) to distinguish the objective from the expression.
- Add the linear expression to be optimized.
- End the objective statement with a semi-colon (**;**).
- Only **1** objective statement can be declared.
- Examples:
  - max: 2x + y;
  - maximize: 2x + y;
  - min: 3x_1 + 2x_2 - 4x_3;
  - minimize: 3x_1 + 2x_2 - 4x_3;

### Functional Constraints
Constraints apply a restriction on variables based on expressions and values. The server recognizes two types of constraints named **relation** constraints and **range** constraints. Only 1 of the 2 can be declared in the same statement.
- **Inequality** refers to less-than (<), less-than-or-equal (<=), greater-than (>), and greater-than-or-equal (>=).
- **Equality** refers to equal (=).
- Every constraint declaration must end with a semi-colon (**;**).
- **Relation Constraint**:
  - Defined to be a inequality or equality, i.e. __expression 1__ [inequality or equality] __expression 2__
  - Examples:
    - 2x + 4y <= 17;
    - 3x_1 - 2x_2 + 3x_3 >= 10;
    - 2x = 5y;
- **Range Constraint**:
  - Defined to be a continuous inequality, i.e. __value 1__ [inequality] __expression__ [inequality] __value 2__
  - By **value**, __value 1__ and __value 2__ are expressions that must evaluate to some number.
  - By **continuous**, a range constraint statement must use the same inequality across the statement.
  - Examples:
    - 2 <= 3x + 5y <= 17;
    - 2 >= 2x - 2y >= 0;
- An __optional name__ for constraints can be declared at the beginning of the statement, following the pattern: [name]: [constraint];
  - Examples:
    - C1: 2x + 4y <= 12;
    - C2: 100 <= 20x + 40y <= 600;
  - Note the necessity of the colon (**:**) to distinguish the name from the constraint.
  - Names cannot be one of the objective types, i.e. **max**, **min**, **maximize**, **minimize**.

### Type Declaration
The server recognizes three unique types: **int**, **bin**, **free**.
- The three types are used to constrain variables to be a certain type of value. Any variables declared in the objective statement and constraint statements are by default **free**. 
- Type declarations are written in the following format:
  - [type]: [each variable separated by commas];
- **int**:
  - The variables declared as **int** can only be integers in the optimal solution.
- **bin**:
  - The variables declared as **bin** can only be binary values in the optimal solution, i.e. 1 or 0.
- **free**:
  - The variables declared as **free** can only be any type of rational number in the optimal solution, including integer and fractional values.
- Examples:
  - int x, y, z;
  - bin x_1, x_2, x_3;
  - free z;
  
### For Statement
For statements can be used to declare multiple constraints or type declarations in a single statement. The following format is used to write a for statement:
- for [iterating variable] = [initial value] to [terminating value]: [constraint or type declaration];
- For each iteration, the any instance of the iterating variable in the constraint or type declaration is substituted by the current value. 
- The iterating variable increments by 1. 
- The terminating value is required to be greater than or equal to the inital value.
- Examples:
  - for i = 1 to 3: 2x_i <= 15;
    - This is equivalent to the following constraints:
      - 2x_1 <= 15;
      - 2x_2 <= 15;
      - 2x_3 <= 15;
  - for i = 1 to 3: int x_i;
    - This is equivalent to the following type declarations:
      - int x_1;
      - int x_2;
      - int x_3;

### Summation Statement
Summations can be used express a long expression succintly. Summations are considered expressions and can be written inside objective or constraint statements. They are written in the following form:
- sum [[iterating variable] = [initial value] to [terminating value]] ([expression])
- The iterating variable, initial value, and terminating value follow the same properties as those in **for** statements.
- Examples: 
  - max: sum [i = 1 to 4] (x_i);
    - This is equivalent to max: x_1 + x_2 + x_3 + x_4; 
  - C1: sum [i = 1 to 4] (2x_i - y_i) <= 23;
    - This is equivalent to C1: 2x_1 - y_1 + 2x_2 - y_2 + 2x_3 - y_3 + 2x_4 - y_4 <= 23;  



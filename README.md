body {
    font-family: Arial, sans-serif;
    text-align: center;
    margin: 0;
    padding: 20px;
    background-color: #ffffff;
    color: #333333;
}

body.dark-mode {
    background-color: #2c3e50;
    color: #ecf0f1;
}

.container {
    max-width: 600px;
    margin: 0 auto;
}

header {
    position: relative;
}

h1 {
    font-size: 24px;
}

.switch {
    position: absolute;
    top: 10px;
    right: 10px;
}

.switch input {
    display: none;
}

.slider {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
    background-color: #ccc;
    border-radius: 24px;
    cursor: pointer;
}

.slider::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    left: 2px;
    top: 2px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
}

input:checked + .slider {
    background-color: #66bb6a;
}

input:checked + .slider::before {
    transform: translateX(26px);
}

.step {
    margin-bottom: 20px;
}

.button-group {
    display: flex;
    justify-content: space-around;
}

button {
    background-color: #f39c12;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
}

button:hover {
    background-color: #e67e22;
}

#result {
    margin-top: 20px;
    font-size: 18px;
}

#loading {
    margin-top: 20px;
}

canvas {
    max-width: 100%;
    margin-top: 20px;
}
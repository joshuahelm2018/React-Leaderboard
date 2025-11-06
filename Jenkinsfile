pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building React app...'
                bat 'npm install'
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                bat 'npm test -- --watchAll=false'
            }
        }
    }
}

pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Fetching source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    echo 'Installing frontend dependencies...'
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    echo 'Building React app...'
                    bat 'npm run build'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    echo 'Running tests...'
                    bat 'npm test -- --watchAll=false'
                }
            }
        }
    }
}

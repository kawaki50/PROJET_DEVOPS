pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-24'
    }
    
    environment {
        DOCKER_IMAGE_BACK = 'myapp-backend:latest'
        DOCKER_IMAGE_FRONT = 'myapp-frontend:latest'
        SONAR_TOKEN = credentials('sonar-token')
    }
    
    stages {
        stage('📥 Checkout') {
            steps {
                checkout scm
                echo '✅ Code récupéré de GitHub'
            }
        }
        
        stage('📦 Install Dependencies') {
            parallel {
                stage('Backend') {
                    steps {
                        dir('app/backend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('app/frontend') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }
        
        stage('🧪 Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('app/backend') {
                            sh 'npm test'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('app/frontend') {
                            sh 'npm test'
                        }
                    }
                }
            }
        }
        
        stage('🔍 SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        docker run --rm \
                            --network host \
                            -v $(pwd):/usr/src \
                            -w /usr/src \
                            sonarsource/sonar-scanner-cli:latest \
                            sonar-scanner \
                                -Dsonar.projectKey=DevOps-Pipeline \
                                -Dsonar.projectName="DevOps-Pipeline" \
                                -Dsonar.sources=app/backend,app/frontend \
                                -Dsonar.exclusions="**/node_modules/**,**/build/**,**/dist/**" \
                                -Dsonar.host.url=http://localhost:9000 \
                                -Dsonar.token=$SONAR_TOKEN
                    '''
                }
            }
        }
        
        stage('🐳 Build Docker Images') {
            parallel {
                stage('Backend Image') {
                    steps {
                        dir('app/backend') {
                            sh 'docker build -t $DOCKER_IMAGE_BACK .'
                        }
                    }
                }
                stage('Frontend Image') {
                    steps {
                        dir('app/frontend') {
                            sh 'docker build -t $DOCKER_IMAGE_FRONT .'
                        }
                    }
                }
            }
        }
        
        stage('🚀 Deploy with Ansible') {
            steps {
                sh '''
                    ansible-playbook -i ansible/inventory ansible/deploy.yml \
                    --extra-vars "backend_image=$DOCKER_IMAGE_BACK frontend_image=$DOCKER_IMAGE_FRONT"
                '''
            }
        }
    }
    
    post {
        always {
            // Nettoyer les images Docker temporaires (optionnel)
            sh 'docker system prune -f || true'
        }
        success {
            echo '🎉 Pipeline exécuté avec succès !'
        }
        failure {
            echo '❌ Le pipeline a échoué'
        }
    }
}
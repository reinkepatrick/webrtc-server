pipeline {
    agent { docker { image 'node' } }
    stages {
        stage('Init') {
            steps {
                sh 'wget -nc https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.2.0.1873-linux.zip'
                sh 'unzip -n sonar-scanner-cli-4.2.0.1873-linux.zip'
                sh 'chmod 400 key.pem'
                sh 'mv sonar-scanner-4.2.0.1873-linux /opt/sonar-scanner'
                sh 'npm install'
            }
        }
        stage('Linting') {
            steps {
                sh 'touch checkstyle-result.xml'
                sh './node_modules/.bin/eslint -f checkstyle index.js > eslint-result.xml ||exit 0'

                recordIssues (
                    enabledForFailure: true, 
                    tool: esLint(pattern: '**/eslint-result.xml'), 
                    healthy: 10, 
                    unhealthy: 100, 
                    failOnError: true,
                    minimumSeverity: 'HIGH', 
                    qualityGates: [
                        [
                            threshold: 10, 
                            type: 'TOTAL'
                        ]
                    ] 
                )

                script {
                    if (currentBuild.currentResult == 'FAILURE' ) {
                        sh 'exit 1'
                    } 
                }
            }
        }
        stage('Testing') {
            steps {
                sh 'npm test'
            }
        }
        stage('Code Coverage') {
            steps {
                sh '/opt/sonar-scanner/bin/sonar-scanner -Dsonar.projectKey=webrtc-server -Dsonar.sources=. -Dsonar.host.url=http://192.168.2.100:9000 -Dsonar.login=3e86fde9f5f9b22df87b465f81e531dff6ed16bf'
            }
        }
        stage('Documentation') {
            steps {
                sh 'npm run docs'
                publishHTML (target : [allowMissing: false,
                             alwaysLinkToLastBuild: false,
                             keepAll: true,
                             reportDir: './docs',
                             reportFiles: 'index.html',
                             reportName: 'Documentation',
                             reportTitles: 'Documentation'])
            }
        }
        stage('Building') {
            steps {
                sh 'chmod +x ./deploy.sh'
                sh './deploy.sh'
            }
        }
    }
    post {
        failure {
            slackSend(color: '#ff2332', message: "Build of webrtc-server failed!")
        }
        success {
            slackSend(color: '#25b248', message: "Build of webrtc-server passed!")
        }
    }
}
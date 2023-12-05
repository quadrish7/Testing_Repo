def DISTRIBUTION_ID   = ['ETLQHLEBGIKKR', 'E335LZ94L5KZ5W', 'E2I8NN5CE9TEN1', 'E180XD7AHIKTAA', 'E10VPIU6G48QXS']
def S3_BUCKET         = "s3://ncgus-tags-resources"

pipeline {
    agent any 
    stages {
        stage('ncgus tracker deployment') {
            steps {
                deleteDir()
                checkout scm
                // Tracker file build steps
                sh "npm install"
                sh "gulp build --env prod"
                //copy existing ncg.js file to "backup" folder
                sh "aws s3 cp ${S3_BUCKET}/prod/ncg/ncg.js ${S3_BUCKET}/backup/ncg.js-build-$BUILD_NUMBER"
                // copy ncg.js file to s3 bucket and invalidate cloudfront
                sh "aws s3 cp dist/ncg.js ${S3_BUCKET}/prod/ncg/"
                script {
                  for ( i in DISTRIBUTION_ID ) {
                    sh "aws cloudfront create-invalidation --distribution-id ${i} --paths '/prod/ncg/*'"
                  }
                }
            }
            post {
                success {
                    echo "Tracker deployment is successfull"
                }
                failure {
                    echo "Deployment failed !!"
                }
            }
        }
    }
}

# docker pull kindest/node:v1.29.2
# docker pull bitwiselearn/codex:js-container
# docker pull bitwiselearn/codex:python-container
# docker pull bitwiselearn/codex:c-container
# docker pull bitwiselearn/codex:cpp-container
# docker pull registry.k8s.io/ingress-nginx/controller:v1.9.5

kind create cluster --config cluster.yml --name codex --image kindest/node:v1.29.2
kubectl config current-context

#kind load docker-image registry.k8s.io/ingress-nginx/controller:v1.9.5 --name codex
kind load docker-image bitwiselearn/codex:js-container --name codex
# kind load docker-image bitwiselearn/codex:python-container --name codex
# kind load docker-image bitwiselearn/codex:java-container --name codex
# kind load docker-image bitwiselearn/codex:c-container --name codex
# kind load docker-image bitwiselearn/codex:cpp-container --name codex

kubectl apply -f deployment.yml
kubectl apply -f service.yml 
#kubectl apply -f ingress.yml 

kubectl get deployment
kubectl get svc 
kubectl port-forward svc/k8s-interview-room-service 8443:8443

# kubectl get ingress 

# kind delete cluster --name codex
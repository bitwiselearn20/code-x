import K8Service from "./service/k8s.service";
import { podConfig, serviceConfig, ingressConfig } from "./utils/config";
import yaml from "yaml";

const serviceInstance = new K8Service({
  localCluster: true,

  clusterName: "kind-codex",
  clusterURL: "https://127.0.0.1:46381",

  userName: "jenkins",
  userPassword:
    "eyJhbGciOiJSUzI1NiIsImtpZCI6ImF4enE4Z3o0ZC1VRFItcVRyZ2s4bEloaGp6V0hFWkRiQk1UcnozUDJ1aWcifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxNzcwOTE2NzYyLCJpYXQiOjE3NzA5MTMxNjIsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJkZWZhdWx0Iiwic2VydmljZWFjY291bnQiOnsibmFtZSI6ImplbmtpbnMiLCJ1aWQiOiJiMmQ4YjAxNy1jMDQxLTQ3ZTEtYTdjMi1iZDk1ZTJhYjQ5ZWEifX0sIm5iZiI6MTc3MDkxMzE2Miwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50OmRlZmF1bHQ6amVua2lucyJ9.pdLsuqJrZmi54rolixcD4xz7XtSlVaNn_6UYBBBZx_mz9pJFsflBgHHp4N0K7Iz6IyDqox-41TxYi7A9RVXSLgUOJj_8D5t-XqPr4yBXvDSmIG3EKrpTyncaiSAx4EsUuoLj1vn126EAxnePyABg5lPZNb9HprVORnsFqPPO6zMWEovCvwTREArVTqHBWF66Nja9LZFL_6PW0LKZ45UunAZrkbDECaLzFQIDfzT4-eIwd1yR9GH4htdKfNZNSenZqerwncTMw4jiUAK09ihvuoNW5WtCX3VrgOxMLzvqFEoBXZU-nYXiyxdKt4r_ngXgB5yrNkAd2M51moLtlKwNEA",
  currentUserName: "kind-codex",
});

async function main() {
  try {
    let podConf = podConfig
      .replace("_podname_", "testing-pod")
      .replace("_podlabel_", "testing");

    const podManifest = yaml.parse(podConf);
    const pod = await serviceInstance.addNewPod("default", podManifest);
    console.log(JSON.stringify(pod));

    let serviceConf = serviceConfig
      .replace("_podname_", "testing-pod")
      .replace("_podlabel_", "testing");

    const serviceManifest = yaml.parse(serviceConf);
    const service = await serviceInstance.addNewService(
      "default",
      serviceManifest,
    );
    console.log(JSON.stringify(service));

    let ingressConf = ingressConfig.replaceAll("_podname_", "testing-pod");
    const ingressManifest = yaml.parse(ingressConf);

    const ingress = await serviceInstance.addNewIngress(
      "default",
      ingressManifest,
    );
    console.log(JSON.stringify(ingress));
  } catch (err) {
    console.error("Kubernetes operation failed:", err);
  }
}

main();

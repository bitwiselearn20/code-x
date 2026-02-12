import * as kubernetes from "@kubernetes/client-node";

interface ClusterConfig {
  clusterName: string;
  clusterURL: string;
  userName: string;
  userPassword: string;
  currentUserName: string;
  localCluster?: boolean;
}

class K8Service {
  kc: kubernetes.KubeConfig | null;
  clusterName: string;
  clusterURL: string;
  userName: string;
  userPassword: string;
  currentUserName: string;
  localCluster: boolean;

  constructor(config?: ClusterConfig) {
    this.kc = null;

    this.clusterName = config?.clusterName ?? "";
    this.clusterURL = config?.clusterURL ?? "";
    this.userName = config?.userName ?? "";
    this.userPassword = config?.userPassword ?? "";
    this.currentUserName = config?.currentUserName ?? "";
    this.localCluster = config?.localCluster ?? true;
  }

  connect() {
    if (this.kc) return;
    if (this.localCluster) {
      console.log("loading from .kube config");
      this.kc = new kubernetes.KubeConfig();
      this.kc.loadFromDefault();
      console.log(this.kc);
      console.log("loaded from .kube");
      return;
    }
    const cluster = {
      name: this.clusterName,
      server: this.clusterURL,
    };

    const user = {
      name: this.userName,
      password: this.userPassword,
    };

    const context = {
      name: this.currentUserName,
      user: user.name,
      cluster: cluster.name,
    };
    this.kc = new kubernetes.KubeConfig();
    this.kc.loadFromOptions({
      clusters: cluster,
      users: user,
      contexts: context,
      currentContext: context.name,
    });
  }
  async addNewIngress(namespace: string, ingressBody: string) {
    this.connect();

    const apiClient = this.kc?.makeApiClient(kubernetes.NetworkingV1Api);

    const output = await apiClient?.createNamespacedIngress({
      namespace,
      body: ingressBody as kubernetes.V1Ingress,
    });

    if (!output) throw new Error("failed to create ingress");

    return output;
  }
  async removeIngress(namespace: string, ingressName: string) {
    this.connect();

    const apiClient = this.kc?.makeApiClient(kubernetes.NetworkingV1Api);

    const output = await apiClient?.deleteNamespacedIngress({
      namespace,
      name: ingressName,
    });

    if (!output) throw new Error("failed to create ingress");

    return output;
  }
  async addNewService(namespace: string, serviceBody: string) {
    this.connect();

    const apiClient = this.kc?.makeApiClient(kubernetes.CoreV1Api);

    const output = await apiClient?.createNamespacedService({
      namespace,
      body: serviceBody as kubernetes.V1Service,
    });

    if (!output) throw new Error("service creation failed");

    return output;
  }
  async removeService(namespace: string, serviceName: string) {
    this.connect();

    const apiClient = this.kc?.makeApiClient(kubernetes.CoreV1Api);

    const output = await apiClient?.deleteNamespacedService({
      namespace,
      name: serviceName,
    });

    if (!output) throw new Error("service deletion failed");

    return output;
  }

  async addNewPod(namespace: string, podBody: string) {
    this.connect();

    const apiClient = this.kc?.makeApiClient(kubernetes.CoreV1Api);

    const output = await apiClient?.createNamespacedPod({
      namespace,
      body: podBody as kubernetes.V1Pod,
    });

    if (!output) throw new Error("pod creation failed");

    return output;
  }
  async removePod(namespace: string, name: string) {
    this.connect();

    const apiClient = this.kc?.makeApiClient(kubernetes.CoreV1Api);

    const output = await apiClient?.deleteNamespacedPod({
      name,
      namespace,
    });

    if (!output) throw new Error("pod deletion failed");

    return output;
  }
}

export default K8Service;

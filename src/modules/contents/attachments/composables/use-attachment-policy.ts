import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import type { Policy } from "@halo-dev/api-client";
import { apiClient } from "@halo-dev/admin-shared";

interface useFetchAttachmentPolicyReturn {
  policies: Ref<Policy[]>;
  loading: Ref<boolean>;
  handleFetchPolicies: () => void;
}

export function useFetchAttachmentPolicy(): useFetchAttachmentPolicyReturn {
  const policies = ref<Policy[]>([] as Policy[]);
  const loading = ref<boolean>(false);

  const handleFetchPolicies = async () => {
    try {
      loading.value = true;
      const { data } =
        await apiClient.extension.storage.policy.liststorageHaloRunV1alpha1Policy();
      policies.value = data.items;
    } catch (e) {
      console.error("Failed to fetch attachment policies", e);
    } finally {
      loading.value = false;
    }
  };

  onMounted(handleFetchPolicies);

  return {
    policies,
    loading,
    handleFetchPolicies,
  };
}

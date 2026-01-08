import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import SubscriptionsMainArea from "@/components/pagesUI/super-admin/subscriptions/SubscriptionsMainArea";

const SubscriptionsPage = () => {
  return (
    <>
      <MetaData pageTitle="Subscription Plans">
        <Wrapper role="super-admin">
          <SubscriptionsMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default SubscriptionsPage;

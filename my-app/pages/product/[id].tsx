import Layout from "../../components/Layout";
import FederatedRemote from "../../components/FederatedRemote";
import { remoteApps } from "../../config/remotes";
import { GetServerSideProps } from "next";

export default function ProductDetailPage({ id }: { id: string }) {
  return (
    <Layout>
      <div className="shell">
        <section className="intro" style={{ marginBottom: "24px" }}>
          <p className="eyebrow">Host app</p>
          <h1 className="app-name-header">Product Details</h1>
          <button 
            onClick={() => window.history.back()} 
            style={{ 
              background: "transparent", 
              border: "1px solid var(--line)", 
              color: "var(--foreground)",
              padding: "8px 16px",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            &larr; Back
          </button>
        </section>

        <section className="remote-grid" aria-label="Micro frontends">
          <article className="remote-panel" style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
            <div className="remote-panel-header">
              <div>
                <p className="eyebrow">myProducts</p>
                <h2>Product Detail</h2>
              </div>
              <span>Remote</span>
            </div>
            
            {id && (
              <FederatedRemote
                global={remoteApps.myProducts.global}
                loadingText="Loading product details..."
                module="./ProductDetail"
                remoteEntryUrl={`${remoteApps.myProducts.url}/_next/static/chunks/remoteEntry.js`}
                productId={Number(id)}
              />
            )}
          </article>
        </section>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      id: context.params?.id || null,
    },
  };
};

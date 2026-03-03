export default function ProductCard({ product, onAddToCart, disabled }) {
  return (
    <article className="card">
      <div className="card__imageWrap">
        <img
          className="card__image"
          src={product.image || "https://picsum.photos/seed/placeholder/500/350"}
          alt={product.name}
          loading="lazy"
        />
      </div>
      <div className="card__body">
        <div className="card__meta">
          <span className="badge">{product.category || "General"}</span>
        </div>
        <h3 className="card__title" title={product.name}>
          {product.name}
        </h3>
        <p className="card__price">₹{Number(product.price || 0).toFixed(0)}</p>
        <button className="btn btn--primary" onClick={() => onAddToCart(product)} disabled={disabled}>
          Add to Cart
        </button>
      </div>
    </article>
  );
}


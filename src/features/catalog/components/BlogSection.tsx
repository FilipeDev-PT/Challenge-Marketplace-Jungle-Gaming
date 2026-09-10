import { toastUnavailable } from '@/components/kurio'
import type { HomeContent } from '@/shared/api/cms-contracts'
type BlogSectionProps = {
  blog: HomeContent['blog']
}
export function BlogSection({ blog }: BlogSectionProps) {
  return (
    <section className="mx-auto mt-24 w-full max-w-[1200px] pb-8" aria-labelledby="blog-heading">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <h2 id="blog-heading" className="text-[28px] font-bold text-text-primary">
          {blog.heading}
        </h2>
        <p className="max-w-2xl text-sm text-text-secondary">{blog.subheading}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {blog.posts.map((post) => (
          <article
            key={post.id}
            className="flex w-full flex-col overflow-hidden rounded-[8px] bg-surface-card"
          >
            <img src={post.imageUrl} alt="" className="h-[195px] w-full object-cover" aria-hidden />
            <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3">
              <p className="whitespace-pre-wrap text-xs font-medium leading-4 text-text-secondary">
                {post.meta}
              </p>
              <h3 className="text-base font-bold text-text-primary">{post.title}</h3>
              <p className="text-xs font-medium leading-4 text-text-secondary">{post.excerpt}</p>
              <button
                type="button"
                className="mt-auto text-left text-xs font-bold leading-[14px] text-text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => toastUnavailable()}
              >
                {post.ctaLabel}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

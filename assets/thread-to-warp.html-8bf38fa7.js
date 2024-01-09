const e=JSON.parse(`{"key":"v-a26c356a","path":"/code/cuda/thread-to-warp.html","title":"Thread如何划分为Warp?","lang":"zh-CN","frontmatter":{"title":"Thread如何划分为Warp?","description":"先看这里（https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#simt-architecture）的一句话： When a multiprocessor is given one or more thread blocks to execute, it partitions them into warps and each warp gets scheduled by a warp scheduler for execution. The way a block is partitioned into warps is always the same; each warp contains threads of consecutive, increasing thread IDs with the first warp containing thread 0. Thread Hierarchy describes how thread IDs relate to thread indices in the block.","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/code/cuda/thread-to-warp.html"}],["meta",{"property":"og:site_name","content":"Jielahou's Blog"}],["meta",{"property":"og:title","content":"Thread如何划分为Warp?"}],["meta",{"property":"og:description","content":"先看这里（https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#simt-architecture）的一句话： When a multiprocessor is given one or more thread blocks to execute, it partitions them into warps and each warp gets scheduled by a warp scheduler for execution. The way a block is partitioned into warps is always the same; each warp contains threads of consecutive, increasing thread IDs with the first warp containing thread 0. Thread Hierarchy describes how thread IDs relate to thread indices in the block."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-01-09T10:09:45.000Z"}],["meta",{"property":"article:modified_time","content":"2024-01-09T10:09:45.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Thread如何划分为Warp?\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-01-09T10:09:45.000Z\\",\\"author\\":[]}"]]},"headers":[],"git":{"createdTime":1704794985000,"updatedTime":1704794985000,"contributors":[{"name":"jielahou","email":"jielahou@gmail.com","commits":1}]},"readingTime":{"minutes":1.36,"words":409},"filePathRelative":"code/cuda/thread-to-warp.md","localizedDate":"2024年1月9日","excerpt":"<p>先看这里（<a href=\\"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#simt-architecture%EF%BC%89%E7%9A%84%E4%B8%80%E5%8F%A5%E8%AF%9D%EF%BC%9A\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#simt-architecture）的一句话：</a></p>\\n<blockquote>\\n<p>When a multiprocessor is given one or more thread blocks to execute, it partitions them into warps and each warp gets scheduled by a <em>warp scheduler</em> for execution. The way a block is partitioned into warps is always the same; each warp contains threads of consecutive, increasing thread IDs with the first warp containing thread 0. Thread Hierarchy describes how thread IDs relate to thread indices in the block.</p>\\n</blockquote>","autoDesc":true}`);export{e as data};

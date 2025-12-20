-- Run this in Supabase SQL Editor to fix Delete button

-- 1. Drop existing ambiguous policies
drop policy if exists "Enable all access" on public.products;
drop policy if exists "Enable all access" on public.bills;
drop policy if exists "Enable all access" on public.bill_items;

-- 2. Drop specific policies if they exist (to avoid "already exists" error)
drop policy if exists "Allow Select Products" on public.products;
drop policy if exists "Allow Insert Products" on public.products;
drop policy if exists "Allow Update Products" on public.products;
drop policy if exists "Allow Delete Products" on public.products;

drop policy if exists "Allow Select Bills" on public.bills;
drop policy if exists "Allow Insert Bills" on public.bills;
drop policy if exists "Allow Delete Bills" on public.bills;

drop policy if exists "Allow Select Items" on public.bill_items;
drop policy if exists "Allow Insert Items" on public.bill_items;
drop policy if exists "Allow Delete Items" on public.bill_items;

-- 3. Create specific policies for each action to be safe
-- Products
create policy "Allow Select Products" on public.products for select using (true);
create policy "Allow Insert Products" on public.products for insert with check (true);
create policy "Allow Update Products" on public.products for update using (true);
create policy "Allow Delete Products" on public.products for delete using (true);

-- Bills
create policy "Allow Select Bills" on public.bills for select using (true);
create policy "Allow Insert Bills" on public.bills for insert with check (true);
create policy "Allow Delete Bills" on public.bills for delete using (true);

-- Bill Items
create policy "Allow Select Items" on public.bill_items for select using (true);
create policy "Allow Insert Items" on public.bill_items for insert with check (true);
create policy "Allow Delete Items" on public.bill_items for delete using (true);

create table multi_fruit_basket (
    id serial not null primary key,
    name text
);
create table fruit_basket_item (
    id serial not null primary key,
    fruit_name text ,
    price decimal(10,2),
    quantity integer,
    multi_id integer,
    foreign key (multi_id) references multi_fruit_basket(id)
);

